// src/modules/streaks/streaks.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { mongoClient } from "../../auth/auth.service.js";

@Injectable()
export class StreaksService {
  private readonly logger = new Logger(StreaksService.name);

  async updateUserStreak(userId: string) {
    try {
      const db = mongoClient.db();
      const usersCollection = db.collection("user");

      // Fetch user directly from MongoDB
      const user = await usersCollection.findOne({ id: userId });

      if (!user) {
        this.logger.warn(`User not found for streak update: ${userId}`);
        return;
      }

      const today = new Date();
      const lastActive = user.lastActiveDate
        ? new Date(user.lastActiveDate as string)
        : null;

      // Dates are tricky; normalize them to ignore time of day
      const todayDateString = today.toISOString().split("T")[0];
      const lastActiveDateString = lastActive?.toISOString().split("T")[0];

      // Already updated today, do nothing
      if (lastActiveDateString === todayDateString) {
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayDateString = yesterday.toISOString().split("T")[0];

      let newStreak = 1; // Default to 1 for a new activity
      if (lastActiveDateString === yesterdayDateString) {
        // It's a consecutive day
        newStreak = ((user.learningStreak as number) || 0) + 1;
      }

      this.logger.log(`Updating streak for user ${userId} to ${newStreak}`);

      // Update user directly in MongoDB
      await usersCollection.updateOne(
        { id: userId },
        {
          $set: {
            learningStreak: newStreak,
            lastActiveDate: todayDateString,
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
