import { IsString, IsNotEmpty } from "class-validator";

export class GenerateChallengeDto {
    @IsString()
    @IsNotEmpty()
    chapterId: string;
}
