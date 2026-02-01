import { useMutation } from '@tanstack/react-query';
import * as aiApi from '../api/ai';

export const useAiRecommendation = () => {
    return useMutation({
        mutationFn: aiApi.getRecommendation,
    });
};
