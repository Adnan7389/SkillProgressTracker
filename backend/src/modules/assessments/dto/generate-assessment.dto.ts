import { IsMongoId } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GenerateAssessmentDto {
  @ApiProperty({
    description: "The MongoDB ID of the chapter to generate an assessment for",
    example: "699034c040ece1e038c74d10",
  })
  @IsMongoId()
  chapterId: string;
}
