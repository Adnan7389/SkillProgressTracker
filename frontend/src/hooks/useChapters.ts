import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as chaptersApi from '../api/chapters';
import type { Chapter } from '../types';

export const useChapters = (pathId: string) => {
    return useQuery<Chapter[]>({
        queryKey: ['chapters', pathId],
        queryFn: () => chaptersApi.getChapters(pathId),
        enabled: !!pathId,
    });
};

export const useCreateChapter = (pathId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: chaptersApi.createChapter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] }); // Update path card counts
        },
    });
};

export const useUpdateChapter = (pathId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Chapter> }) =>
            chaptersApi.updateChapter(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
        },
    });
};

export const useDeleteChapter = (pathId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: chaptersApi.deleteChapter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
        },
    });
};

export const useToggleChapter = (pathId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
            chaptersApi.toggleChapterStatus(id, isCompleted),

        // When mutate is called:
        onMutate: async ({ id, isCompleted }) => {
            // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['chapters', pathId] });

            // 2. Snapshot the previous value
            const previousChapters = queryClient.getQueryData<Chapter[]>(['chapters', pathId]);

            // 3. Optimistically update to the new value
            queryClient.setQueryData<Chapter[]>(['chapters', pathId], (old) => {
                if (!old) return [];
                return old.map((chapter) =>
                    chapter._id === id ? { ...chapter, isCompleted } : chapter
                );
            });

            // Return a context object with the snapshotted value
            return { previousChapters };
        },

        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (_err, _variables, context) => {
            if (context?.previousChapters) {
                queryClient.setQueryData(['chapters', pathId], context.previousChapters);
            }
        },

        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
            queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
            queryClient.invalidateQueries({ queryKey: ['learning-path', pathId] });
        },
    });
};

export const useAddChapterNote = (pathId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chapterId, text }: { chapterId: string; text: string }) =>
            chaptersApi.addChapterNote(chapterId, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
        },
    });
};

export const useDiscoverResources = (pathId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chapterId: string) => chaptersApi.discoverResources(chapterId),
        onSuccess: () => {
            // Poll for updates after a short delay (resources are discovered async)
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
            }, 3000);
        },
    });
};

export const useRefreshResources = (pathId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chapterId: string) => chaptersApi.refreshResources(chapterId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
            // Poll again after delay for async completion
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['chapters', pathId] });
            }, 5000);
        },
    });
};
