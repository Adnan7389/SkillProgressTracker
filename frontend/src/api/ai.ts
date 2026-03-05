import { api } from '../lib/api';
import type { AiRecommendation } from '../types';

export interface JobStatusResponse {
    status: 'waiting' | 'active' | 'completed' | 'failed';
    progress: number;
    result?: { pathId: string; name: string };
    error?: string;
}

export const getRecommendation = async (pathId: string): Promise<AiRecommendation> => {
    const { data } = await api.post('/ai/recommend', { learningPathId: pathId });
    return data;
};

export const generateRoadmap = async (topic: string, skillLevel: string): Promise<{ jobId: string }> => {
    const { data } = await api.post('/ai/generate-roadmap', { topic, skillLevel });
    return data;
};

export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
    const { data } = await api.get(`/ai/job-status/${jobId}`);
    return data;
};
