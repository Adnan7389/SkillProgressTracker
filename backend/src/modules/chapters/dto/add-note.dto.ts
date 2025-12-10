// src/modules/chapters/dto/add-note.dto.ts
import { IsString, MaxLength } from "class-validator";

export class AddNoteDto {
  @IsString()
  @MaxLength(1000)
  text: string;
}
