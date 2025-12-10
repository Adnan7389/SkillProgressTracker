import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
export class Note {
  @Prop({ required: true, maxlength: 1000 })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ type: Types.ObjectId, ref: "LearningPath", required: true })
  learningPathId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000, default: "" })
  description: string;

  @Prop({ enum: ["easy", "medium", "hard"], default: "medium" })
  difficulty: string;

  @Prop({ min: 5, max: 300, default: 30 })
  estimatedMinutes: number;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: null })
  completionDate: Date;

  @Prop({ type: [NoteSchema], default: [] })
  notes: Note[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);

ChapterSchema.index({ learningPathId: 1, createdAt: 1 });
ChapterSchema.index({ userId: 1, isCompleted: 1 });
ChapterSchema.index({ userId: 1, completionDate: -1 });
