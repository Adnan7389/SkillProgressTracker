import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddNoteDto {
  @ApiProperty({
    description: "The content of the note",
    example: "This is a great chapter on Flexbox!",
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  text: string;
}
