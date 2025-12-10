// src/modules/chapters/dto/update-chapter.dto.ts
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from "class-validator";

export class UpdateChapterDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(["easy", "medium", "hard"])
  @IsOptional()
  difficulty?: "easy" | "medium" | "hard";

  @IsNumber()
  @IsOptional()
  @Min(5)
  @Max(300)
  estimatedMinutes?: number;
}
