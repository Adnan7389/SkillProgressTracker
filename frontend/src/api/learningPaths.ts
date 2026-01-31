import { api } from '../lib/api';
import type { LearningPath } from '../types';

export const getLearningPaths = async (): Promise<LearningPath[]> => {
    const { data } = await api.get('/learning-paths');
    return data;
};

export const createLearningPath = async (newPath: Partial<LearningPath>): Promise<LearningPath> => {
    const { data } = await api.post('/learning-paths', newPath);
    return data;
};
