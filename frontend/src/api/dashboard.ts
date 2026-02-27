import { api } from "../lib/api";

export interface DashboardStats {
    totalPaths: number;
    completedPaths: number;
    totalChapters: number;
    completedChapters: number;
    overallProgress: number;
    learningStreak: number;
    mostActivePath: { name: string; progress: number } | null;
    totalEstimatedMinutes: number;
    skillLevelBreakdown: {
        beginner: number;
        intermediate: number;
        advanced: number;
    };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const { data } = await api.get("/dashboard/stats");
    return data;
};
