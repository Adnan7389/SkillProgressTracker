import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChallengeDocument = Challenge & Document;

@Schema({ timestamps: true })
export class Challenge {
    @Prop({ type: Types.ObjectId, ref: "Chapter", required: true })
    chapterId: Types.ObjectId;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ required: true, trim: true, maxlength: 500 })
    task: string;

    @Prop({ required: true, trim: true, maxlength: 300 })
    objective: string;

    @Prop({ enum: ["easy", "medium", "hard"], default: "medium" })
    difficulty: string;

    @Prop({ min: 5, max: 60, default: 15 })
    estimatedMinutes: number;

    @Prop({ trim: true, maxlength: 500, default: "" })
    hint: string;

    @Prop({ trim: true, maxlength: 2000, default: "" })
    userResponse: string;

    @Prop({ default: false })
    isCompleted: boolean;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

ChallengeSchema.index({ chapterId: 1, userId: 1 });
ChallengeSchema.index({ userId: 1, isCompleted: 1 });
