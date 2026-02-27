import {
    TrendingUp,
    FolderOpen,
    BookCheck,
    Flame,
    Clock,
    Trophy,
} from "lucide-react";
import type { DashboardStats } from "../../api/dashboard";

interface StatsOverviewProps {
    stats?: DashboardStats;
    isLoading: boolean;
}

export default function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl h-[100px]"
                    />
                ))}
            </div>
        );
    }

    const formatHoursAndMinutes = (totalMinutes: number = 0) => {
        if (totalMinutes === 0) return "0m";
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours === 0) return `${minutes}m`;
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Overall Progress */}
            <div className="p-5 md:p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center gap-4 hover:border-[var(--primary)] transition-colors group relative overflow-hidden">
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full" />
                <div
                    className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${stats?.overallProgress || 0}%` }}
                />
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                        Overall Progress
                    </div>
                    <div className="text-2xl md:text-3xl font-black">
                        {stats?.overallProgress || 0}%
                    </div>
                </div>
            </div>

            {/* Learning Streak */}
            <div className="p-5 md:p-6 bg-[var(--card)] border border-orange-500/30 rounded-2xl flex items-center gap-4 hover:border-orange-500 transition-colors group">
                <div className="p-3 bg-orange-500/10 rounded-xl group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300 relative">
                    <Flame className="w-6 h-6 text-orange-500 relative z-10" />
                    {(stats?.learningStreak || 0) > 3 && (
                        <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-full animate-pulse z-0" />
                    )}
                </div>
                <div>
                    <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                        Learning Streak
                    </div>
                    <div className="text-2xl md:text-3xl font-black flex items-baseline gap-1">
                        {stats?.learningStreak || 0}
                        <span className="text-sm md:text-base font-bold text-[var(--muted-foreground)] ml-1">
                            days
                        </span>
                    </div>
                </div>
            </div>

            {/* Study Time */}
            <div className="p-5 md:p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center gap-4 hover:border-[var(--primary)] transition-colors group">
                <div className="p-3 bg-teal-500/10 rounded-xl group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                    <Clock className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                    <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                        Total Study Time
                    </div>
                    <div className="text-2xl md:text-3xl font-black">
                        {formatHoursAndMinutes(stats?.totalEstimatedMinutes)}
                    </div>
                </div>
            </div>

            {/* Chapters Completed */}
            <div className="p-5 md:p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center gap-4 hover:border-[var(--primary)] transition-colors group">
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                    <BookCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1">
                    <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                        Chapters Done
                    </div>
                    <div className="flex items-end justify-between w-full">
                        <span className="text-2xl md:text-3xl font-black">
                            {stats?.completedChapters || 0}
                        </span>
                        <span className="text-sm font-medium text-[var(--muted-foreground)] mb-1">
                            of {stats?.totalChapters || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Learning Paths */}
            <div className="p-5 md:p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center gap-4 hover:border-[var(--primary)] transition-colors group">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                    <FolderOpen className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                    <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                        Completed Paths
                    </div>
                    <div className="flex items-end justify-between w-full">
                        <span className="text-2xl md:text-3xl font-black">
                            {stats?.completedPaths || 0}
                        </span>
                        <span className="text-sm font-medium text-[var(--muted-foreground)] mb-1">
                            of {stats?.totalPaths || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Most Active Path */}
            <div className="p-5 md:p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center gap-4 hover:border-[var(--primary)] transition-colors group">
                <div className="p-3 bg-amber-500/10 rounded-xl group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                    <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div className="overflow-hidden w-full">
                    <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
                        Focus Path
                    </div>
                    {stats?.mostActivePath ? (
                        <div>
                            <div className="text-sm md:text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                {stats.mostActivePath.name}
                            </div>
                            <div className="text-xs text-[var(--muted-foreground)] font-medium mt-1">
                                {stats.mostActivePath.progress}% Complete
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-[var(--muted-foreground)]">
                            No paths yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
