import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useJobStatus = (jobId: string | null) => {
    return useQuery({
        queryKey: ['job-status', jobId],
        queryFn: () => aiApi.getJobStatus(jobId!),
        enabled: !!jobId,
        refetchInterval: (query) => {
            const status = query.state?.data?.status;
            if (status === 'completed' || status === 'failed') {
                return false; // Stop polling
            }
            return 2000; // Poll every 2 seconds
        },
    });
};
