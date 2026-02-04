export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
    id: string;
    name: string;
    email: string;
    learningStreak: number;
    lastActiveDate: string;
}

export interface LearningPath {
    _id: string;
    userId: string;
    name: string;
    description?: string;
    skillLevel: SkillLevel;
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Note {
    text: string;
    createdAt: string;
}

export interface Chapter {
    _id: string;
    learningPathId: string;
    userId: string;
    title: string;
    description?: string;
    difficulty: Difficulty;
    estimatedMinutes: number;
    isCompleted: boolean;
    completionDate?: string;
    notes: Note[];
    createdAt: string;
    updatedAt: string;
}

export interface AiRecommendation {
    nextChapterTitle: string;
    reason: string;
    strategy: 'cache' | 'llm' | 'fallback';
}
