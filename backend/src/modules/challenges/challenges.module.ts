import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChallengesController } from "./challenges.controller.js";
import { ChallengesService } from "./challenges.service.js";
import { Challenge, ChallengeSchema } from "./schemas/challenge.schema.js";
import { ChaptersModule } from "../chapters/chapters.module.js";
import { LearningPathsModule } from "../learning-paths/learning-paths.module.js";
import { AiModule } from "../ai/ai.module.js";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Challenge.name, schema: ChallengeSchema },
        ]),
        ChaptersModule,
        LearningPathsModule,
        AiModule,
    ],
    controllers: [ChallengesController],
    providers: [ChallengesService],
})
export class ChallengesModule { }
