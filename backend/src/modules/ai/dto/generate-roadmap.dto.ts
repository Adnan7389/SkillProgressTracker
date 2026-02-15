import { IsString, IsEnum, MinLength, MaxLength } from "class-validator";

export class GenerateRoadmapDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  topic: string;

  @IsEnum(["beginner", "intermediate", "advanced"])
  skillLevel: string;
}
