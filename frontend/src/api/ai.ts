import { api } from '../lib/api';
import type { AiRecommendation } from '../types';

export const getRecommendation = async (pathId: string): Promise<AiRecommendation> => {
    const { data } = await api.post('/ai/recommend', { learningPathId: pathId });
    return data;
};

export const generateRoadmap = async (topic: string, skillLevel: string): Promise<{ pathId: string; name: string }> => {
    const { data } = await api.post('/ai/generate-roadmap', { topic, skillLevel });
    return data;
};
