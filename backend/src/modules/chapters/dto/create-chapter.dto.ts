import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChapterDto {
  @ApiProperty({
    description: "The title of the chapter",
    example: "Introduction to HTML",
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: "A description of what the chapter covers",
    example: "Learn the basic structure of an HTML document.",
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: "The difficulty level of the chapter",
    enum: ["easy", "medium", "hard"],
    example: "easy",
    required: false,
  })
  @IsEnum(["easy", "medium", "hard"])
  @IsOptional()
  difficulty?: "easy" | "medium" | "hard";

  @ApiProperty({
    description: "Estimated time to complete the chapter in minutes",
    minimum: 5,
    maximum: 300,
    example: 45,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(300)
  estimatedMinutes?: number;
}

