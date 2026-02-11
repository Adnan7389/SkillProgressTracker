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

export interface Resource {
    type: 'doc' | 'youtube';
    title: string;
    url: string;
    description: string;
    priority: number;
}

export type ResourceStatus = 'pending' | 'completed' | 'failed';

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
    resources: Resource[];
    resourceStatus: ResourceStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AiRecommendation {
    nextChapterTitle: string;
    reason: string;
    strategy: 'cache' | 'llm' | 'fallback';
}

