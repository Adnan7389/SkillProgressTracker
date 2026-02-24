import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class SubmitResponseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    response: string;
}
