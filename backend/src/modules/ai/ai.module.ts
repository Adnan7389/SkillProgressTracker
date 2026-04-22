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
    CacheModule.registerAsync({
      useFactory: async () => {
        const redisUrl = process.env.REDIS_URL;

        console.log("CACHE REDIS_URL:", redisUrl);

        if (!redisUrl && process.env.NODE_ENV === "production") {
          throw new Error("REDIS_URL is required for cache in production");
        }

        return {
          store: await redisStore({
            url:
              redisUrl ||
              `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379
              }`,
          }),
          ttl: 86400,
        };
      },
    }),
    BullModule.registerQueue({
      name: "roadmap-generation",
    }),
    LearningPathsModule,
    ChaptersModule,
  ],
  controllers: [AiController],
  providers: [
    AiService,
    AiClientService,
    ResourceDiscoveryService,
    RoadmapProcessor,
  ],
  exports: [AiService, ResourceDiscoveryService, AiClientService],
})
export class AiModule { }