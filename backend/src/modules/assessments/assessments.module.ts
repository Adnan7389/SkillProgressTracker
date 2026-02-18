import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AssessmentsController } from "./assessments.controller.js";
import { AssessmentsService } from "./assessments.service.js";
import { Assessment, AssessmentSchema } from "./schemas/assessment.schema.js";
import { QuizAttempt, QuizAttemptSchema } from "./schemas/quiz-attempt.schema.js";
import { ChaptersModule } from "../chapters/chapters.module.js";
import { AiModule } from "../ai/ai.module.js";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: QuizAttempt.name, schema: QuizAttemptSchema },
    ]),
    ChaptersModule,
    AiModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
})
export class AssessmentsModule { }
