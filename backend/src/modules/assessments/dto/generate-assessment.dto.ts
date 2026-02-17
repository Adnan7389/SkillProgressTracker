import { IsMongoId } from "class-validator";

export class GenerateAssessmentDto {
  @IsMongoId()
  chapterId: string;
}
