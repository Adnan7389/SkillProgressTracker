import { IsString, IsEnum, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GenerateRoadmapDto {
  @ApiProperty({
    description: "The topic to generate a roadmap for",
    example: "React Development",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  topic: string;

  @ApiProperty({
    description: "The starting skill level",
    enum: ["beginner", "intermediate", "advanced"],
    example: "beginner",
  })
  @IsEnum(["beginner", "intermediate", "advanced"])
  skillLevel: string;
}
