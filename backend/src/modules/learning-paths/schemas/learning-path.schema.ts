import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class LearningPath extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, trim: true, maxlength: 100 })
    name: string;

    @Prop({ trim: true, maxlength: 500, default: '' })
    description: string;

    @Prop({
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    })
    skillLevel: string;

    @Prop({ default: 0, min: 0, max: 100 })
    progress: number;
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);

// Add index
LearningPathSchema.index({ userId: 1, createdAt: -1 });
