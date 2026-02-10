// src/modules/ai/ai.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AiClientService } from './ai-client.service.js';
import { ResourceDiscoveryService } from './resource-discovery.service.js';
import { LearningPathsService } from '../learning-paths/learning-paths.service.js';
import { ChaptersService } from '../chapters/chapters.service.js';
import { z } from 'zod';

// Define the schema for a single chapter in the roadmap
const ChapterSchema = z.object({
    title: z.string().max(200),
    description: z.string().max(1000).optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    estimatedMinutes: z.number().min(5).max(300).default(30),
});

// Define the schema for the full roadmap
const RoadmapSchema = z.object({
    pathName: z.string().max(100),
    description: z.string().max(500),
    chapters: z.array(ChapterSchema).min(1).max(10),
});

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly aiClientService: AiClientService,
        private readonly resourceDiscoveryService: ResourceDiscoveryService,
        private readonly learningPathsService: LearningPathsService,
        private readonly chaptersService: ChaptersService,
    ) { }

    async getRecommendation(userId: string, learningPathId: string) {
        const cacheKey = `rec-${userId}-${learningPathId}`;

        // Check cache first
        const cachedData = await this.cacheManager.get<{ nextChapterTitle: string; reason: string }>(cacheKey);
        if (cachedData) {
            this.logger.log('Returning cached AI recommendation');
            return { ...cachedData, strategy: 'cache' };
        }

        try {
            const result = await this.generateNewRecommendation(userId, learningPathId);
            await this.cacheManager.set(cacheKey, result);
            return { ...result, strategy: 'llm' };
        } catch (error) {
            this.logger.error('AI generation failed, using fallback', error.stack);
            const fallback = await this.getFallbackRecommendation(userId, learningPathId);
            return { ...fallback, strategy: 'fallback' };
        }
    }

    async generateRoadmap(userId: string, topic: string, skillLevel: string) {
        this.logger.log(`Generating AI roadmap for topic: ${topic} (${skillLevel})`);

        const prompt = `
You are an expert curriculum designer. Generate a structured learning path for the topic: "${topic}" at a "${skillLevel}" level.
The learning path should be logically ordered and suitable for the requested skill level.

Respond ONLY with a JSON object that follows this exact structure:
{
  "pathName": "Short descriptive name for the path",
  "description": "Brief summary of what will be learned",
  "chapters": [
    {
      "title": "Clear chapter title",
      "description": "What this chapter covers",
      "difficulty": "easy" | "medium" | "hard",
      "estimatedMinutes": number (between 15 and 60)
    }
  ]
}

Limit the roadmap to between 3 and 7 chapters.
`;

        try {
            const responseText = await this.aiClientService.generateText(prompt);
            const parsedData = this.parseAndValidateRoadmap(responseText);

            // 1. Create the Learning Path
            const path = await this.learningPathsService.create(userId, {
                name: parsedData.pathName,
                description: parsedData.description,
                skillLevel: skillLevel as any,
            });

            // 2. Create the Chapters and collect their IDs
            const createdChapters: Array<{ id: string; title: string }> = [];
            for (const chapterData of parsedData.chapters) {
                const chapter = await this.chaptersService.create(userId, path._id.toString(), {
                    title: chapterData.title,
                    description: chapterData.description,
                    difficulty: chapterData.difficulty as any,
                    estimatedMinutes: chapterData.estimatedMinutes,
                });
                createdChapters.push({ id: chapter._id.toString(), title: chapter.title });
            }

            // 3. Fire-and-forget: discover resources for all chapters asynchronously
            this.resourceDiscoveryService
                .discoverForChapters(createdChapters, userId, parsedData.pathName, skillLevel)
                .catch(err => this.logger.error('Background resource discovery failed', err.stack));

            return { pathId: path._id, name: path.name };
        } catch (error) {
            this.logger.error(`Roadmap generation failed: ${error.message}`, error.stack);
            throw new Error(`Failed to generate roadmap: ${error.message}`);
        }
    }

    private parseAndValidateRoadmap(responseText: string) {
        let jsonText = responseText.trim();
        // Remove markdown blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7);
        }
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3);
        }
        jsonText = jsonText.trim();

        try {
            const rawData = JSON.parse(jsonText);
            return RoadmapSchema.parse(rawData);
        } catch (err) {
            this.logger.error('Invalid AI response structure', err);
            throw new Error('AI returned an invalid roadmap structure. Please try again.');
        }
    }

    private async generateNewRecommendation(userId: string, learningPathId: string) {
        const path = await this.learningPathsService.findOne(learningPathId, userId);
        const chapters = await this.chaptersService.findAllByPath(userId, learningPathId);

        const completed = chapters.filter(c => c.isCompleted).map(c => c.title).join(', ') || 'None';
        const incomplete = chapters.filter(c => !c.isCompleted).map(c => c.title).join(', ') || 'None';

        const prompt = `
You are a helpful learning assistant. Based on the following information, recommend the very next single chapter to study.
- Learning Path: "${path.name}"
- User's Skill Level: ${path.skillLevel}
- Chapters already completed: ${completed}
- Chapters remaining: ${incomplete}

Respond in JSON format with the fields: "nextChapterTitle", "reason".
The "nextChapterTitle" must be an exact match from the remaining chapters list.
The "reason" should be a brief, encouraging explanation of why this is the best next step.
Example: {"nextChapterTitle": "Introduction to JSX", "reason": "It's the foundational syntax for building components in React."}
`;

        const responseText = await this.aiClientService.generateText(prompt);

        // Parse JSON from response (handle potential markdown code blocks)
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7);
        }
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3);
        }
        jsonText = jsonText.trim();

        return JSON.parse(jsonText);
    }

    private async getFallbackRecommendation(userId: string, learningPathId: string) {
        const chapters = await this.chaptersService.findAllByPath(userId, learningPathId);
        const firstIncomplete = chapters.find(c => !c.isCompleted);

        if (firstIncomplete) {
            return {
                nextChapterTitle: firstIncomplete.title,
                reason: 'This is the next chapter in your learning path.',
            };
        }

        return {
            nextChapterTitle: 'All chapters completed!',
            reason: 'Congratulations! You have completed all the chapters in this learning path.',
        };
    }
}
