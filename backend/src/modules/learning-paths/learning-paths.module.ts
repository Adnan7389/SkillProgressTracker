import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPathsController } from './learning-paths.controller.js';
import { LearningPathsService } from './learning-paths.service.js';
import { LearningPath, LearningPathSchema } from './schemas/learning-path.schema.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LearningPath.name, schema: LearningPathSchema }
        ]),
    ],
    controllers: [LearningPathsController],
    providers: [LearningPathsService],
    exports: [LearningPathsService],
})
export class LearningPathsModule { }
