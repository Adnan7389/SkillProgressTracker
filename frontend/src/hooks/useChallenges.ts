import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as challengesApi from '../api/challenges';

export const useChallenge = (chapterId: string) => {
    return useQuery({
        queryKey: ['challenge', chapterId],
        queryFn: () => challengesApi.getChallenge(chapterId),
        enabled: !!chapterId,
    });
};

export const useChallengeHistory = (chapterId: string) => {
    return useQuery({
        queryKey: ['challenge-history', chapterId],
        queryFn: () => challengesApi.getChallengeHistory(chapterId),
        enabled: !!chapterId,
    });
};

export const useGenerateChallenge = (chapterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => challengesApi.generateChallenge(chapterId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenge', chapterId] });
            queryClient.invalidateQueries({ queryKey: ['challenge-history', chapterId] });
        },
    });
};

export const useSubmitChallengeResponse = (chapterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ challengeId, response }: { challengeId: string; response: string }) =>
            challengesApi.submitChallengeResponse(challengeId, response),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenge', chapterId] });
            queryClient.invalidateQueries({ queryKey: ['challenge-history', chapterId] });
        },
    });
};
