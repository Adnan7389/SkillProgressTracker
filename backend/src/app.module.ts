import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { TestController } from "./test/test.controller.js";
import { LearningPathsModule } from "./modules/learning-paths/learning-paths.module.js";
import { ChaptersModule } from "./modules/chapters/chapters.module.js";
import { AiModule } from "./modules/ai/ai.module.js";
import { AssessmentsModule } from "./modules/assessments/assessments.module.js";
import { ChallengesModule } from "./modules/challenges/challenges.module.js";
import { DashboardModule } from "./modules/dashboard/dashboard.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LearningPathsModule,
    ChaptersModule,
    AiModule,
    AssessmentsModule,
    ChallengesModule,
    DashboardModule,
  ],
  controllers: [AppController, TestController],
})
export class AppModule { }
