import { api } from '../lib/api';
import type { Challenge } from '../types';

export const generateChallenge = async (chapterId: string): Promise<Challenge> => {
    const { data } = await api.post('/challenges/generate', { chapterId });
    return data;
};

export const getChallenge = async (chapterId: string): Promise<Challenge | null> => {
    const { data } = await api.get(`/challenges/chapter/${chapterId}`);
    return data;
};

export const getChallengeHistory = async (chapterId: string): Promise<Challenge[]> => {
    const { data } = await api.get(`/challenges/history/${chapterId}`);
    return data;
};

export const submitChallengeResponse = async (
    challengeId: string,
    response: string,
): Promise<Challenge> => {
    const { data } = await api.post(`/challenges/${challengeId}/respond`, { response });
    return data;
};
