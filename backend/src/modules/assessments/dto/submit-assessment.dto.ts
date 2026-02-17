import {
  IsMongoId,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from "class-validator";

export class SubmitAssessmentDto {
  @IsMongoId()
  assessmentId: string;

  @IsMongoId()
  chapterId: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  @IsNumber({}, { each: true })
  answers: number[];
}
