import { api } from '../lib/api';
import type { Chapter, Difficulty } from '../types';

export const getChapters = async (pathId: string): Promise<Chapter[]> => {
    const { data } = await api.get(`/chapters/in-path/${pathId}`);
    return data;
};

interface CreateChapterInput {
    learningPathId: string;
    title: string;
    description?: string;
    difficulty?: Difficulty;
    estimatedMinutes?: number;
}

export const createChapter = async (input: CreateChapterInput): Promise<Chapter> => {
    const { learningPathId, ...chapterData } = input;
    const { data: response } = await api.post(`/chapters/in-path/${learningPathId}`, chapterData);
    return response;
};

export const updateChapter = async (id: string, data: Partial<Chapter>): Promise<Chapter> => {
    const { data: response } = await api.patch(`/chapters/${id}`, data);
    return response;
};

export const deleteChapter = async (id: string): Promise<void> => {
    await api.delete(`/chapters/${id}`);
};

export const toggleChapterStatus = async (id: string, isCompleted: boolean): Promise<Chapter> => {
    const endpoint = isCompleted ? `/chapters/${id}/complete` : `/chapters/${id}/incomplete`;
    const { data } = await api.patch(endpoint);
    return data;
};

export const addChapterNote = async (chapterId: string, text: string): Promise<Chapter> => {
    const { data } = await api.post(`/chapters/${chapterId}/notes`, { text });
    return data;
};
