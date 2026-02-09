import { useMutation } from '@tanstack/react-query';
import * as aiApi from '../api/ai';

export const useAiRecommendation = () => {
    return useMutation({
        mutationFn: aiApi.getRecommendation,
    });
};

export const useGenerateRoadmap = () => {
    return useMutation({
        mutationFn: ({ topic, skillLevel }: { topic: string; skillLevel: string }) =>
            aiApi.generateRoadmap(topic, skillLevel),
    });
};
