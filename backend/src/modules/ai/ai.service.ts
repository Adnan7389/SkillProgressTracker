// src/modules/ai/ai.service.ts
import { Injectable, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { AiClientService } from "./ai-client.service.js";
import { ResourceDiscoveryService } from "./resource-discovery.service.js";
import { LearningPathsService } from "../learning-paths/learning-paths.service.js";
import { ChaptersService } from "../chapters/chapters.service.js";
import { z } from "zod";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue("roadmap-generation") private roadmapQueue: Queue,
    private readonly aiClientService: AiClientService,
    private readonly resourceDiscoveryService: ResourceDiscoveryService,
    private readonly learningPathsService: LearningPathsService,
    private readonly chaptersService: ChaptersService,
  ) {}

  async getRecommendation(userId: string, learningPathId: string) {
    const cacheKey = `rec-${userId}-${learningPathId}`;

    // Check cache first
    const cachedData = await this.cacheManager.get<{
      nextChapterTitle: string;
      reason: string;
    }>(cacheKey);
    if (cachedData) {
      this.logger.log("Returning cached AI recommendation");
      return { ...cachedData, strategy: "cache" };
    }

    try {
      const result = await this.generateNewRecommendation(
        userId,
        learningPathId,
      );
      await this.cacheManager.set(cacheKey, result);
      return { ...result, strategy: "llm" };
    } catch (error) {
      this.logger.error("AI generation failed, using fallback", error.stack);
      const fallback = await this.getFallbackRecommendation(
        userId,
        learningPathId,
      );
      return { ...fallback, strategy: "fallback" };
    }
  }

  async generateRoadmap(userId: string, topic: string, skillLevel: string) {
    this.logger.log(`Queueing roadmap generation for topic: ${topic} (${skillLevel})`);
    
    const job = await this.roadmapQueue.add("generate", { userId, topic, skillLevel }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    });
    return { jobId: job.id };
  }

  async getJobStatus(jobId: string) {
    const job = await this.roadmapQueue.getJob(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const state = await job.getState();
    return {
      status: state, // 'waiting', 'active', 'completed', 'failed'
      progress: job.progress,
      result: state === "completed" ? job.returnvalue : null,
      error: state === "failed" ? job.failedReason : null,
    };
  }

  private async generateNewRecommendation(
    userId: string,
    learningPathId: string,
  ) {
    const path = await this.learningPathsService.findOne(
      learningPathId,
      userId,
    );
    const chapters = await this.chaptersService.findAllByPath(
      userId,
      learningPathId,
    );

    const completed =
      chapters
        .filter((c) => c.isCompleted)
        .map((c) => c.title)
        .join(", ") || "None";
    const incomplete =
      chapters
        .filter((c) => !c.isCompleted)
        .map((c) => c.title)
        .join(", ") || "None";

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

    return JSON.parse(jsonText);
  }

  private async getFallbackRecommendation(
    userId: string,
    learningPathId: string,
  ) {
    const chapters = await this.chaptersService.findAllByPath(
      userId,
      learningPathId,
    );
    const firstIncomplete = chapters.find((c) => !c.isCompleted);

    if (firstIncomplete) {
      return {
        nextChapterTitle: firstIncomplete.title,
        reason: "This is the next chapter in your learning path.",
      };
    }

    return {
      nextChapterTitle: "All chapters completed!",
      reason:
        "Congratulations! You have completed all the chapters in this learning path.",
    };
  }
}
