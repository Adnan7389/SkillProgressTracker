// src/modules/ai/dto/get-recommendation.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class GetRecommendationDto {
    @IsString()
    @IsNotEmpty()
    learningPathId: string;
}
