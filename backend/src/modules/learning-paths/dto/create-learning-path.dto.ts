import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateLearningPathDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(["beginner", "intermediate", "advanced"])
  skillLevel: "beginner" | "intermediate" | "advanced";
}
