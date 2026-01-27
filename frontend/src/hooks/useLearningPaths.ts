import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LearningPath } from '../types';

export const useLearningPaths = () => {
    return useQuery<LearningPath[]>({
        queryKey: ['learning-paths'],
        queryFn: async () => {
            const { data } = await api.get('/learning-paths');
            return data;
        },
    });
};

export const useCreateLearningPath = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newPath: Partial<LearningPath>) => {
            const { data } = await api.post('/learning-paths', newPath);
            return data;
        },
        onSuccess: () => {
            // Invalidate the cache to trigger a re-fetch of the list
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
        },
    });
};
