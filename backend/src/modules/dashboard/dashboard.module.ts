import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DashboardController } from "./dashboard.controller.js";
import { DashboardService } from "./dashboard.service.js";
import {
    LearningPath,
    LearningPathSchema,
} from "../learning-paths/schemas/learning-path.schema.js";
import { Chapter, ChapterSchema } from "../chapters/schemas/chapter.schema.js";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LearningPath.name, schema: LearningPathSchema },
            { name: Chapter.name, schema: ChapterSchema },
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
