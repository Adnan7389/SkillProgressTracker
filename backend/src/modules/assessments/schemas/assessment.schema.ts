import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type AssessmentDocument = Assessment & Document;

@Schema({ _id: false })
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({
    type: [String],
    required: true,
    validate: [arrayLimit, "Must have exactly 4 options"],
  })
  options: string[];

  @Prop({ required: true, min: 0, max: 3 })
  answer: number;

  @Prop({ required: true })
  explanation: string;
}

function arrayLimit(val) {
  return val.length === 4;
}

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ type: Types.ObjectId, ref: "Chapter", required: true, unique: true })
  chapterId: Types.ObjectId;

  @Prop({ type: [Question], required: true })
  questions: Question[];
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
AssessmentSchema.index({ chapterId: 1 });
