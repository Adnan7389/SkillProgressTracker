import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChaptersController } from "./chapters.controller.js";
import { ChaptersService } from "./chapters.service.js";
import { Chapter, ChapterSchema } from "./schemas/chapter.schema.js";
import { LearningPathsModule } from "../learning-paths/learning-paths.module.js";
import { StreaksModule } from "../streaks/streaks.module.js";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
    LearningPathsModule, // For progress update
    StreaksModule,
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
