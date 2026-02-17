import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type QuizAttemptDocument = QuizAttempt & Document;

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: string; // Using string as Better Auth user IDs are strings

  @Prop({ type: Types.ObjectId, ref: "Assessment", required: true })
  assessmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Chapter", required: true })
  chapterId: Types.ObjectId;

  @Prop({ type: [Number], required: true })
  answers: number[]; // Array of selected option indices

  @Prop({ required: true, min: 0, max: 100 })
  score: number;
}

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
// Compound index to quickly find a user's attempt for a specific chapter
QuizAttemptSchema.index({ userId: 1, chapterId: 1 });
