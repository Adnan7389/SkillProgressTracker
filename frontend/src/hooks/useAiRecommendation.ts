import { useMutation } from '@tanstack/react-query';
import * as aiApi from '../api/ai';
import type { AiRecommendation } from '../types';

export const useAiRecommendation = () => {
    return useMutation<AiRecommendation, Error, string>({
        mutationFn: aiApi.getRecommendation,
    });
};

export const useGenerateRoadmap = () => {
    return useMutation({
        mutationFn: ({ topic, skillLevel }: { topic: string; skillLevel: string }) =>
            aiApi.generateRoadmap(topic, skillLevel),
    });
};
