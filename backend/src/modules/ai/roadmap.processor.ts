import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { AiClientService } from "./ai-client.service.js";
import { ResourceDiscoveryService } from "./resource-discovery.service.js";
import { LearningPathsService } from "../learning-paths/learning-paths.service.js";
import { ChaptersService } from "../chapters/chapters.service.js";
import { z } from "zod";

const ChapterSchema = z.object({
    title: z.string().max(200),
    description: z.string().max(1000).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    estimatedMinutes: z.number().min(30).max(240).default(60),
});

const RoadmapSchema = z.object({
    pathName: z.string().max(100),
    description: z.string().max(500),
    chapters: z.array(ChapterSchema).min(1).max(10),
});

interface GenerateRoadmapJobData {
    userId: string;
    topic: string;
    skillLevel: string;
}

@Processor("roadmap-generation")
export class RoadmapProcessor extends WorkerHost {
    private readonly logger = new Logger(RoadmapProcessor.name);

    constructor(
        private readonly aiClientService: AiClientService,
        private readonly resourceDiscoveryService: ResourceDiscoveryService,
        private readonly learningPathsService: LearningPathsService,
        private readonly chaptersService: ChaptersService,
    ) {
        super();
    }

    async process(job: Job<GenerateRoadmapJobData, any, string>): Promise<any> {
        const { userId, topic, skillLevel } = job.data;
        this.logger.log(`Processing roadmap generation job ${job.id} for topic: ${topic}`);

        try {
            await job.updateProgress(10); // Connecting to AI

            const prompt = `
You are an expert curriculum designer. Generate a structured learning path for the topic: "${topic}" at a "${skillLevel}" level.
The learning path should be logically ordered and suitable for the requested skill level.

Time estimation rules:
- Base your estimatedMinutes on real-world study time, including reading, practice, and review.
- Beginner chapters: 30–90 minutes (foundational concepts with guided examples).
- Intermediate chapters: 60–150 minutes (applied practice, deeper theory).
- Advanced chapters: 90–240 minutes (complex projects, research, or architecture-level thinking).
- Do NOT underestimate. A chapter on "React State Management" should be at least 90 minutes, not 15.

Respond ONLY with a JSON object that follows this exact structure:
{
  "pathName": "Short descriptive name for the path",
  "description": "Brief summary of what will be learned",
  "chapters": [
    {
      "title": "Clear chapter title",
      "description": "What this chapter covers",
      "difficulty": "easy" | "medium" | "hard",
      "estimatedMinutes": number (between 30 and 240, be realistic)
    }
  ]
}

Limit the roadmap to between 3 and 7 chapters.
`;

            const responseText = await this.aiClientService.generateText(prompt);
            await job.updateProgress(50); // Parsing response

            const parsedData = this.parseAndValidateRoadmap(responseText);
            await job.updateProgress(60); // Saving learning path

            // 1. Create the Learning Path
            const path = await this.learningPathsService.create(userId, {
                name: parsedData.pathName,
                description: parsedData.description,
                skillLevel: skillLevel as any,
            });

            await job.updateProgress(75); // Saving chapters

            // 2. Create the Chapters and collect their IDs
            const createdChapters: Array<{ id: string; title: string }> = [];
            for (const chapterData of parsedData.chapters) {
                const chapter = await this.chaptersService.create(
                    userId,
                    path._id.toString(),
                    {
                        title: chapterData.title,
                        description: chapterData.description,
                        difficulty: chapterData.difficulty as any,
                        estimatedMinutes: chapterData.estimatedMinutes,
                    },
                );
                createdChapters.push({
                    id: chapter._id.toString(),
                    title: chapter.title,
                });
            }

            await job.updateProgress(90); // Triggering resource discovery

            // 3. Fire-and-forget: discover resources for all chapters asynchronously
            this.resourceDiscoveryService
                .discoverForChapters(
                    createdChapters,
                    userId,
                    parsedData.pathName,
                    skillLevel,
                )
                .catch((err) =>
                    this.logger.error("Background resource discovery failed", err.stack),
                );

            await job.updateProgress(100); // Complete
            this.logger.log(`Job ${job.id} completed successfully`);

            return { pathId: path._id.toString(), name: path.name };
        } catch (error) {
            this.logger.error(`Failed to process job ${job.id}: ${error.message}`, error.stack);
            throw error; // BullMQ will catch this and mark the job as failed
        }
    }

    private parseAndValidateRoadmap(responseText: string) {
        let jsonText = responseText.trim();
        // Remove markdown blocks if present
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.slice(7);
        }
        if (jsonText.startsWith("```")) {
            jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith("```")) {
            jsonText = jsonText.slice(0, -3);
        }
        jsonText = jsonText.trim();

        try {
            const rawData = JSON.parse(jsonText);
            return RoadmapSchema.parse(rawData);
        } catch (err) {
            this.logger.error("Invalid AI response structure", err);
            throw new Error(
                "AI returned an invalid roadmap structure. Please try again.",
            );
        }
    }
}
