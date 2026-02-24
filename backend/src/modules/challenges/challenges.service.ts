import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Challenge, ChallengeDocument } from "./schemas/challenge.schema.js";
import { ChaptersService } from "../chapters/chapters.service.js";
import { LearningPathsService } from "../learning-paths/learning-paths.service.js";
import { AiClientService } from "../ai/ai-client.service.js";
import { z } from "zod";

const ChallengeResponseSchema = z.object({
    task: z.string().max(500),
    objective: z.string().max(300),
    difficulty: z.enum(["easy", "medium", "hard"]),
    estimatedMinutes: z.number().min(5).max(60),
    hint: z.string().max(500).optional().default(""),
});

@Injectable()
export class ChallengesService {
    private readonly logger = new Logger(ChallengesService.name);

    constructor(
        @InjectModel(Challenge.name)
        private readonly challengeModel: Model<ChallengeDocument>,
        private readonly chaptersService: ChaptersService,
        private readonly learningPathsService: LearningPathsService,
        private readonly aiClientService: AiClientService,
    ) { }

    async generate(userId: string, chapterId: string) {
        // 1. Verify chapter exists and user has access
        const chapter = await this.chaptersService.findOne(chapterId, userId);
        const path = await this.learningPathsService.findOne(
            chapter.learningPathId.toString(),
            userId,
        );

        // 2. Build context-aware prompt
        const notesStr =
            chapter.notes?.map((n) => n.text).join("\n") || "No notes yet";
        const prompt = this.buildPrompt(
            chapter.title,
            chapter.description,
            path.name,
            path.skillLevel,
            notesStr,
        );

        try {
            // 3. Call AI and validate
            const responseText = await this.aiClientService.generateText(prompt);
            const parsed = this.parseAndValidate(responseText);

            // 4. Save new challenge document
            const challenge = new this.challengeModel({
                chapterId: chapter._id,
                userId,
                task: parsed.task,
                objective: parsed.objective,
                difficulty: parsed.difficulty,
                estimatedMinutes: parsed.estimatedMinutes,
                hint: parsed.hint,
            });

            return await challenge.save();
        } catch (error) {
            this.logger.error(
                `Challenge generation failed: ${error.message}`,
                error.stack,
            );
            throw new BadRequestException(
                "Failed to generate challenge. Please try again.",
            );
        }
    }

    async findByChapter(userId: string, chapterId: string) {
        // Return the most recent challenge for this chapter
        const challenge = await this.challengeModel
            .findOne({ chapterId: new Types.ObjectId(chapterId), userId })
            .sort({ createdAt: -1 })
            .exec();

        return challenge || null;
    }

    async getHistory(userId: string, chapterId: string) {
        return this.challengeModel
            .find({ chapterId: new Types.ObjectId(chapterId), userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    async submitResponse(userId: string, challengeId: string, response: string) {
        const challenge = await this.challengeModel.findById(challengeId).exec();

        if (!challenge) {
            throw new NotFoundException("Challenge not found");
        }

        if (challenge.userId !== userId) {
            throw new ForbiddenException("Access denied");
        }

        challenge.userResponse = response;
        challenge.isCompleted = true;
        return challenge.save();
    }

    private buildPrompt(
        chapterTitle: string,
        chapterDescription: string,
        pathName: string,
        skillLevel: string,
        notes: string,
    ): string {
        return `You are an expert learning coach. Generate ONE practical mini-challenge for a learner.

Context:
- Learning Path: "${pathName}"
- Chapter: "${chapterTitle}"
- Chapter Description: "${chapterDescription}"
- Skill Level: "${skillLevel}"
- Learner's Notes: "${notes}"

Rules:
- This is NOT a quiz or multiple-choice question.
- Generate a practical, actionable task the learner can complete in 5-30 minutes.
- The task should require the learner to APPLY the concept, not just recall it.
- Adapt to the domain:
  - For programming topics: give a coding exercise (e.g., "Build a function that...")
  - For business/management: give a real-world scenario (e.g., "Draft an email that..." or "Analyze this situation...")
  - For any other field: give a hands-on exercise appropriate to that domain
- The hint should give a starting direction without revealing the full answer.

Respond ONLY with a JSON object. No markdown, no explanation, no code blocks.

The JSON object MUST follow this exact structure:
{
  "task": "Clear description of what to do (max 500 chars)",
  "objective": "What skill this exercises (max 300 chars)",
  "difficulty": "easy" | "medium" | "hard",
  "estimatedMinutes": number (between 5 and 30),
  "hint": "A helpful starting hint (max 500 chars)"
}`;
    }

    private parseAndValidate(
        responseText: string,
    ): z.infer<typeof ChallengeResponseSchema> {
        let jsonText = responseText.trim();
        if (jsonText.startsWith("```json")) jsonText = jsonText.slice(7);
        if (jsonText.startsWith("```")) jsonText = jsonText.slice(3);
        if (jsonText.endsWith("```")) jsonText = jsonText.slice(0, -3);
        jsonText = jsonText.trim();

        try {
            const rawData = JSON.parse(jsonText);
            return ChallengeResponseSchema.parse(rawData);
        } catch (err) {
            this.logger.error("Invalid AI challenge response structure", err);
            throw new Error("AI returned an invalid challenge structure.");
        }
    }
}
