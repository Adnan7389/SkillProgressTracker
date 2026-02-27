import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../api/dashboard";
import type { DashboardStats } from "../api/dashboard";

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: dashboardApi.getDashboardStats,
    });
};
