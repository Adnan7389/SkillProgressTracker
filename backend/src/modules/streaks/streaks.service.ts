// src/modules/streaks/streaks.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { mongoClient } from "../../auth/auth.service.js";

@Injectable()
export class StreaksService {
  private readonly logger = new Logger(StreaksService.name);

  /**
   * Normalize a date to YYYY-MM-DD format
   * Returns null if date is invalid to prevent crashes
   */
  private normalize(date: Date | null | undefined): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split("T")[0];
  }

  async updateUserStreak(userId: string) {
    try {
      const db = mongoClient.db();
      const usersCollection = db.collection("user");

      // Fetch user directly from MongoDB
      const user = await usersCollection.findOne({ _id: userId as any });

      if (!user) {
        this.logger.warn(`User not found for streak update: ${userId}`);
        return;
      }

      const today = new Date();
      const todayStr = this.normalize(today);

      const lastActive = user.lastActiveDate
        ? new Date(user.lastActiveDate as string)
        : null;

      const lastStr = this.normalize(lastActive);

      // Already updated today, do nothing
      if (lastStr === todayStr) {
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yStr = this.normalize(yesterday);

      let newStreak = 1; // Default to 1 for a new activity
      if (lastStr === yStr) {
        // It's a consecutive day
        newStreak = (user.learningStreak ?? 0) + 1;
      }

      this.logger.log(`Updating streak for user ${userId} → ${newStreak}`);

      // Update user directly in MongoDB
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
