import { api } from '../lib/api';
import type { Assessment, QuizAttempt, AssessmentResult } from '../types';

export const generateAssessment = async (chapterId: string): Promise<Assessment> => {
    const { data } = await api.post('/assessments/generate', { chapterId });
    return data;
};

export const submitAssessment = async (
    assessmentId: string,
    chapterId: string,
    answers: number[]
): Promise<AssessmentResult> => {
    const { data } = await api.post('/assessments/submit', { assessmentId, chapterId, answers });
    return data;
};

export const getAttemptHistory = async (chapterId: string): Promise<QuizAttempt[]> => {
    const { data } = await api.get(`/assessments/history/${chapterId}`);
    return data;
};
