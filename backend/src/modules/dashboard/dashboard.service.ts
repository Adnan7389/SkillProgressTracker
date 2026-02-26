import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LearningPath } from "../learning-paths/schemas/learning-path.schema.js";
import { Chapter } from "../chapters/schemas/chapter.schema.js";
import { mongoClient } from "../../auth/auth.service.js";

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        @InjectModel(LearningPath.name)
        private learningPathModel: Model<LearningPath>,
        @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    ) { }

    async getStats(userId: string) {
        try {
            // 1. Get basic path stats
            const totalPaths = await this.learningPathModel.countDocuments({
                userId,
            });

            const completedPaths = await this.learningPathModel.countDocuments({
                userId,
                progress: 100, // Assuming 100 is fully completed
            });

            // 2. Get chapter stats
            const totalChapters = await this.chapterModel.countDocuments({ userId });

            const completedChapters = await this.chapterModel.countDocuments({
                userId,
                isCompleted: true,
            });

            // 3. Get overall progress
            // Compute average progress across all paths
            const allPaths = await this.learningPathModel
                .find({ userId })
                .select("progress")
                .exec();

            const overallProgress =
                allPaths.length > 0
                    ? Math.round(
                        allPaths.reduce((acc, path) => acc + (path.progress || 0), 0) /
                        allPaths.length,
                    )
                    : 0;

            // 4. Get most active path
            const mostActivePathDoc = await this.learningPathModel
                .findOne({ userId })
                .sort({ progress: -1, updatedAt: -1 })
                .select("name progress")
                .exec();

            const mostActivePath = mostActivePathDoc
                ? { name: mostActivePathDoc.name, progress: mostActivePathDoc.progress }
                : null;

            // 5. Get total estimated minutes from aggregate
            const aggregateResult = await this.chapterModel.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: null,
                        totalMinutes: { $sum: "$estimatedMinutes" },
                    },
                },
            ]);

            const totalEstimatedMinutes =
                aggregateResult.length > 0 ? aggregateResult[0].totalMinutes : 0;

            // 6. Get user streak from Better Auth 'user' collection
            let learningStreak = 0;
            try {
                const db = mongoClient.db();
                const usersCollection = db.collection("user");
                const user = await usersCollection.findOne({ _id: userId as any });
                if (user && typeof user.learningStreak === "number") {
                    learningStreak = user.learningStreak;
                }
            } catch (e) {
                this.logger.error("Failed to fetch user learning streak", e);
            }

            // 7. Get skill level breakdown
            const skillBreakdown = await this.learningPathModel.aggregate([
                { $match: { userId: userId } },
                {
                    $group: {
                        _id: "$skillLevel",
                        count: { $sum: 1 },
                    },
                },
            ]);

            const skillLevelBreakdown = {
                beginner: 0,
                intermediate: 0,
                advanced: 0,
            };

            skillBreakdown.forEach((item) => {
                if (item._id === "beginner") skillLevelBreakdown.beginner = item.count;
                if (item._id === "intermediate")
                    skillLevelBreakdown.intermediate = item.count;
                if (item._id === "advanced") skillLevelBreakdown.advanced = item.count;
            });

            return {
                totalPaths,
                completedPaths,
                totalChapters,
                completedChapters,
                overallProgress,
                learningStreak,
                mostActivePath,
                totalEstimatedMinutes,
                skillLevelBreakdown,
            };
        } catch (error) {
            this.logger.error(`Failed to get dashboard stats for user ${userId}`, error);
            throw error;
        }
    }
}
