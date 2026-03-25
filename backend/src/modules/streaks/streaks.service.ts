import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { mongoClient } from "../../auth/auth.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";

@Injectable()
export class StreaksService {
  private readonly logger = new Logger(StreaksService.name);

  constructor(private readonly notificationsService: NotificationsService) { }

  /**
   * Normalize a date to YYYY-MM-DD format
   */
  private normalize(date: Date | null | undefined): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split("T")[0];
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleStreakResets() {
    this.logger.log('"Running daily streak reset check..."');
    const db = mongoClient.db();
    const usersCollection = db.collection("user");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.normalize(yesterday);

    // Reset streaks for users who haven't been active since before yesterday
    const result = await usersCollection.updateMany(
      {
        lastActiveDate: { $ne: yesterdayStr, $exists: true },
        learningStreak: { $gt: 0 },
      },
      {
        $set: { learningStreak: 0 },
      },
    );

    this.logger.log(
      `Streak reset complete. Updated ${result.modifiedCount} users.`,
    );
  }

  @Cron("0 18 * * *") // Every day at 6:00 PM
  async sendStreakReminders() {
    this.logger.log(`'Sending daily streak reminders...'`);
    const db = mongoClient.db();
    const usersCollection = db.collection("user");

    const todayStr = this.normalize(new Date());

    // Find users with a streak who haven't been active today
    const usersToRemind = await usersCollection.find({
      lastActiveDate: { $ne: todayStr },
      learningStreak: { $gt: 0 },
      email: { $exists: true },
    })
      .toArray();

    for (const user of usersToRemind) {
      await this.notificationsService.sendStreakReminder(
        user.email as string,
        (user.name as string) || "Scholar",
        (user.learningStreak as number) || 0,
      );
    }

    this.logger.log(
      `Reminder process complete. Sent ${usersToRemind.length} emails.`,
    );
  }

  async updateUserStreak(userId: string) {
    try {
      const db = mongoClient.db();
      const usersCollection = db.collection("user");

      const user = await usersCollection.findOne({ _id: userId as any });

      if (!user) {
        this.logger.warn(`User not found for streak update: ${userId}`);
        return;
      }

      const today = new Date();
      const todayStr = this.normalize(today);
      const lastStr = user.lastActiveDate as string;

      if (lastStr === todayStr) return;

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yStr = this.normalize(yesterday);

      let newStreak = 1;
      if (lastStr === yStr) {
        newStreak = (user.learningStreak ?? 0) + 1;
      }

      await usersCollection.updateOne(
        { _id: userId as any },
        {
          $set: {
            learningStreak: newStreak,
            lastActiveDate: todayStr,
          },
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to update streak for user ${userId}`,
        error.stack,
      );
    }
  }
}
