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

export interface Challenge {
    _id: string;
    chapterId: string;
    userId: string;
    task: string;
    objective: string;
    difficulty: Difficulty;
    estimatedMinutes: number;
    hint?: string;
    userResponse: string;
    isCompleted: boolean;
    createdAt: string;
}

export interface AiRecommendation {
    nextChapterTitle: string;
    reason: string;
    strategy: 'cache' | 'llm' | 'fallback';
}

export interface Question {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
}

export interface Assessment {
    _id: string;
    chapterId: string;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

export interface QuizAttempt {
    _id: string;
    userId: string;
    assessmentId: string;
    chapterId: string;
    answers: number[];
    score: number;
    createdAt: string;
}

export interface AssessmentResult {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    feedback: {
        questionNumber: number;
        isCorrect: boolean;
        correctOption: number;
        explanation: string;
    }[];
}

