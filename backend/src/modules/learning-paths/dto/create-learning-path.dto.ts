import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLearningPathDto {
  @ApiProperty({
    description: "The name of the learning path",
    example: "Full Stack Web Development",
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: "A brief description of the learning path",
    example: "Learn how to build modern web applications from scratch.",
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: "The difficulty level of the material",
    enum: ["beginner", "intermediate", "advanced"],
    example: "beginner",
  })
  @IsEnum(["beginner", "intermediate", "advanced"])
  skillLevel: "beginner" | "intermediate" | "advanced";
}

