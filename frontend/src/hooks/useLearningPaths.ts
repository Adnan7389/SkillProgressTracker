import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as learningPathsApi from '../api/learningPaths';
import type { LearningPath } from '../types';

export const useLearningPaths = () => {
    return useQuery<LearningPath[]>({
        queryKey: ['learning-paths'],
        queryFn: learningPathsApi.getLearningPaths,
    });
};

export const useCreateLearningPath = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: learningPathsApi.createLearningPath,
        onSuccess: () => {
            // Invalidate the cache to trigger a re-fetch of the list
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
        },
    });
};
