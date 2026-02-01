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

export interface Chapter {
    _id: string;
    learningPathId: string;
    title: string;
    content?: string;
    videoUrl?: string;
    isCompleted: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AiRecommendation {
    nextChapterTitle: string;
    reason: string;
    strategy: 'cache' | 'llm' | 'fallback';
}
