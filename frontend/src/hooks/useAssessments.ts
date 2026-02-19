import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as assessmentsApi from '../api/assessments';
import type { QuizAttempt } from '../types';

export const useAssessment = (chapterId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => assessmentsApi.generateAssessment(chapterId),
        onSuccess: (data) => {
            queryClient.setQueryData(['assessment', chapterId], data);
        },
    });
};

export const useSubmitAssessment = (chapterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ assessmentId, answers }: { assessmentId: string; answers: number[] }) =>
            assessmentsApi.submitAssessment(assessmentId, chapterId, answers),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assessment-history', chapterId] });
            queryClient.invalidateQueries({ queryKey: ['chapters'] }); // Update progress if linked
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
        },
    });
};

export const useAssessmentHistory = (chapterId: string) => {
    return useQuery<QuizAttempt[]>({
        queryKey: ['assessment-history', chapterId],
        queryFn: () => assessmentsApi.getAttemptHistory(chapterId),
        enabled: !!chapterId,
    });
};
