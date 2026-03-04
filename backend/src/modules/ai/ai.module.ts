// src/modules/ai/ai.module.ts
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { BullModule } from "@nestjs/bullmq";
import { AiController } from "./ai.controller.js";
import { AiService } from "./ai.service.js";
import { AiClientService } from "./ai-client.service.js";
import { ResourceDiscoveryService } from "./resource-discovery.service.js";
import { RoadmapProcessor } from "./roadmap.processor.js";
import { LearningPathsModule } from "../learning-paths/learning-paths.module.js";
import { ChaptersModule } from "../chapters/chapters.module.js";

@Module({
  imports: [
    // In-memory cache for 24 hours (86400 seconds)
    CacheModule.register({
      ttl: 86400,
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
