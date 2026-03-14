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

export class UpdateChapterDto {
  @ApiProperty({
    description: "The updated title of the chapter",
    example: "Advanced HTML Techniques",
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: "The updated description",
    example: "Deep dive into semantic elements and accessibility.",
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: "The updated difficulty level",
    enum: ["easy", "medium", "hard"],
    example: "medium",
    required: false,
  })
  @IsEnum(["easy", "medium", "hard"])
  @IsOptional()
  difficulty?: "easy" | "medium" | "hard";

  @ApiProperty({
    description: "The updated estimated time in minutes",
    minimum: 5,
    maximum: 300,
    example: 60,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(300)
  estimatedMinutes?: number;
}

