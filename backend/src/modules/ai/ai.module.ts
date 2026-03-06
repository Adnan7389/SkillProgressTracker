// src/modules/ai/ai.module.ts
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { BullModule } from "@nestjs/bullmq";
import { redisStore } from "cache-manager-redis-yet";
import { AiController } from "./ai.controller.js";
import { AiService } from "./ai.service.js";
import { AiClientService } from "./ai-client.service.js";
import { ResourceDiscoveryService } from "./resource-discovery.service.js";
import { RoadmapProcessor } from "./roadmap.processor.js";
import { LearningPathsModule } from "../learning-paths/learning-paths.module.js";
import { ChaptersModule } from "../chapters/chapters.module.js";

@Module({
  imports: [
    // Distributed Redis cache for 24 hours (86400 seconds)
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`,
        }),
        ttl: 86400,
      }),
    }),
    BullModule.registerQueue({
      name: "roadmap-generation",
    }),
    LearningPathsModule,
    ChaptersModule,
  ],
  controllers: [AiController],
  providers: [AiService, AiClientService, ResourceDiscoveryService, RoadmapProcessor],
  exports: [AiService, ResourceDiscoveryService, AiClientService],
})
export class AiModule { }
