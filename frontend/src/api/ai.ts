import { api } from '../lib/api';
import type { AiRecommendation } from '../types';

export const getRecommendation = async (pathId: string): Promise<AiRecommendation> => {
    const { data } = await api.post('/ai/recommend', { learningPathId: pathId });
    return data;
};
