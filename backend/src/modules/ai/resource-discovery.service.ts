// src/modules/ai/resource-discovery.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { AiClientService } from './ai-client.service.js';
import { ChaptersService } from '../chapters/chapters.service.js';
import { z } from 'zod';

// Zod schema for validating a single resource from the AI response
const ResourceItemSchema = z.object({
    type: z.enum(['doc', 'youtube']),
    title: z.string().max(200),
    url: z.string().url().max(500),
    description: z.string().max(300).default(''),
});

// Zod schema for the full AI response (object with resources array)
const ResourceResponseSchema = z.object({
    resources: z.array(ResourceItemSchema).min(1).max(6)
});

@Injectable()
export class ResourceDiscoveryService {
    private readonly logger = new Logger(ResourceDiscoveryService.name);

    constructor(
        private readonly aiClientService: AiClientService,
        private readonly chaptersService: ChaptersService,
    ) { }

    /**
     * Discover and attach resources for a single chapter.
     * This method is designed to be called asynchronously (fire-and-forget).
     */
    async discoverForChapter(
        chapterId: string,
        userId: string,
        chapterTitle: string,
        pathName: string,
        skillLevel: string,
    ): Promise<void> {
        this.logger.log(`Discovering resources for chapter: "${chapterTitle}"`);

        try {
            const prompt = this.buildPrompt(chapterTitle, pathName, skillLevel);
            const responseText = await this.aiClientService.generateText(prompt);
            const resources = this.parseAndValidate(responseText);

            // Assign priority based on array position and type (docs first, then youtube)
            const prioritized = resources
                .sort((a, b) => {
                    if (a.type === 'doc' && b.type === 'youtube') return -1;
                    if (a.type === 'youtube' && b.type === 'doc') return 1;
                    return 0;
                })
                .map((resource, index) => ({
                    ...resource,
                    priority: index + 1,
                }));

            await this.chaptersService.updateResources(chapterId, userId, prioritized, 'completed');
            this.logger.log(`Successfully attached ${prioritized.length} resources to chapter: "${chapterTitle}"`);
        } catch (error) {
            this.logger.error(`Resource discovery failed for chapter "${chapterTitle}": ${error.message}`);
            // Mark as failed so the UI can show a retry option
            try {
                await this.chaptersService.updateResources(chapterId, userId, [], 'failed');
            } catch (updateError) {
                this.logger.error(`Failed to update resourceStatus to "failed": ${updateError.message}`);
            }
        }
    }

    /**
     * Discover resources for multiple chapters in parallel.
     * Uses Promise.allSettled so one failure doesn't block others.
     */
    async discoverForChapters(
        chapters: Array<{ id: string; title: string }>,
        userId: string,
        pathName: string,
        skillLevel: string,
    ): Promise<void> {
        this.logger.log(`Starting resource discovery for ${chapters.length} chapters`);

        const promises = chapters.map(chapter =>
            this.discoverForChapter(
                chapter.id,
                userId,
                chapter.title,
                pathName,
                skillLevel,
            ),
        );

        await Promise.allSettled(promises);
        this.logger.log('Resource discovery completed for all chapters');
    }

    private buildPrompt(chapterTitle: string, pathName: string, skillLevel: string): string {
        return `You are a learning resource curator. Recommend learning resources for the following chapter.

Topic: "${chapterTitle}"
Learning Path: "${pathName}"
Skill Level: "${skillLevel}"

Respond ONLY with a JSON object. No markdown, no explanation, no code blocks.

The JSON object MUST follow this exact structure:
{
  "resources": [
    {
      "type": "doc" (or "youtube"),
      "title": "short title",
      "url": "full valid url",
      "description": "short description"
    }
  ]
}

Constraints:
- Return exactly 3 documentation resources and exactly 2 YouTube resources (5 total) in the "resources" array
- Documentation resources MUST come first, YouTube resources last
- "type" must be exactly "doc" or "youtube"
- "title" must be max 60 characters, no special characters
- "description" must be max 100 characters, NO newlines
- URLs must be valid and start with https://
- Prefer official docs (MDN, etc.) and reputable YouTube channels (Fireship, etc.)

Example response:
{"resources":[{"type":"doc","title":"MDN CSS Basics","url":"https://developer.mozilla.org/en-US/docs/Learn/CSS","description":"Official MDN guide covering CSS fundamentals"},{"type":"youtube","title":"CSS Crash Course","url":"https://www.youtube.com/watch?v=example","description":"Beginner-friendly CSS tutorial"}]}
`;
    }

    private parseAndValidate(responseText: string): z.infer<typeof ResourceResponseSchema>['resources'] {
        let jsonText = responseText.trim();

        // Remove markdown code blocks if present
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
            const parsed = ResourceResponseSchema.parse(rawData);
            return parsed.resources;
        } catch (err) {
            this.logger.error('Invalid AI resource response structure', err);
            throw new Error('AI returned an invalid resource structure.');
        }
    }
}
