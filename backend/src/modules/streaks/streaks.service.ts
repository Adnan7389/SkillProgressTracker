import { Injectable, Logger } from "@nestjs/common";
import { mongoClient } from "../../auth/auth.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";

@Injectable()
export class StreaksService {
  private readonly logger = new Logger(StreaksService.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Normalize a date to YYYY-MM-DD format
   */
  private normalize(date: Date | null | undefined): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split("T")[0];
  }

  /**
   * Check if the current UTC time matches a user's configured reminder hour
   * in their local timezone.
   *
   * Example: User has timezone "America/New_York" and reminderHour 18.
   * If the current UTC time is 22:00, New York local time is 18:00 (EDT) → match.
   */
  private isUserReminderTime(
    user: { timezone?: string; reminderHour?: number },
    now: Date,
  ): boolean {
    const timezone = (user.timezone as string) || "UTC";
    const reminderHour = (user.reminderHour as number) ?? 18;

    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "numeric",
        hour12: false,
      });

      const localHour = parseInt(formatter.format(now), 10);
      return localHour === reminderHour;
    } catch {
      // Invalid timezone string — fall back to treating it as UTC
      this.logger.warn(`Invalid timezone "${timezone}" for user, defaulting to UTC`);
      return now.getUTCHours() === reminderHour;
    }
  }

  /**
   * Reset streaks for users who haven't been active since before yesterday.
   * Called externally via POST /api/v1/internal/reset-streaks
   */
  async handleStreakResets(): Promise<{ processed: number; reset: number }> {
    this.logger.log("Running daily streak reset check...");
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

    return {
      processed: result.matchedCount,
      reset: result.modifiedCount,
    };
  }

  /**
   * Send streak reminder emails to users who:
   * 1. Have an active streak but haven't logged in today
   * 2. Are in a timezone where the current hour matches their reminderHour
   * 3. Haven't already been reminded today (idempotency)
   *
   * Called externally via POST /api/v1/internal/run-reminders
   */
  async sendStreakReminders(): Promise<{
    processed: number;
    sent: number;
    skipped: number;
  }> {
    this.logger.log("Sending daily streak reminders...");
    const db = mongoClient.db();
    const usersCollection = db.collection("user");

    const now = new Date();
    const todayStr = this.normalize(now)!;

    // Find users with a streak who haven't been active today
    // and haven't already been reminded today (idempotency)
    const usersToRemind = await usersCollection
      .find({
        lastActiveDate: { $ne: todayStr },
        learningStreak: { $gt: 0 },
        email: { $exists: true },
        lastReminderSentAt: { $ne: todayStr },
      })
      .toArray();

    let sent = 0;
    let skipped = 0;

    for (const user of usersToRemind) {
      // Check if it's the right time in the user's timezone
      if (!this.isUserReminderTime(user as unknown as { timezone?: string; reminderHour?: number }, now)) {
        skipped++;
        continue;
      }

      try {
        await this.notificationsService.sendStreakReminder(
          user.email as string,
          (user.name as string) || "Scholar",
          (user.learningStreak as number) || 0,
        );

        // Mark as reminded today (idempotency)
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { lastReminderSentAt: todayStr } },
        );

        sent++;
      } catch (error) {
        this.logger.error(
          `Failed to send reminder to ${user.email}`,
          error.stack,
        );
        skipped++;
      }
    }

    this.logger.log(
      `Reminder process complete. Processed: ${usersToRemind.length}, Sent: ${sent}, Skipped: ${skipped}`,
    );

    return {
      processed: usersToRemind.length,
      sent,
      skipped,
    };
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
