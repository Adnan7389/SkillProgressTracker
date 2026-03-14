import { PartialType } from "@nestjs/swagger";
import { CreateLearningPathDto } from "./create-learning-path.dto.js";

export class UpdateLearningPathDto extends PartialType(CreateLearningPathDto) { }
