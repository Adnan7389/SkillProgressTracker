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
            <div className={`p-5 md:p-6 bg-[var(--card)] border rounded-2xl flex items-center gap-4 transition-all duration-500 group relative overflow-hidden ${
                (stats?.learningStreak || 0) > 0 
                ? 'border-orange-500/50 shadow-lg shadow-orange-500/10' 
                : 'border-[var(--border)]'
            }`}>
                {/* Background Glow for high streaks */}
                {(stats?.learningStreak || 0) > 0 && (
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full animate-pulse" />
                )}
                
                <div className={`p-3 rounded-xl transition-all duration-500 relative ${
                    (stats?.learningStreak || 0) > 0 
                    ? 'bg-orange-500/20 scale-110 shadow-inner' 
                    : 'bg-orange-500/10'
                }`}>
                    <Flame className={`w-6 h-6 relative z-10 transition-colors ${
                        (stats?.learningStreak || 0) > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-orange-400'
                    }`} />
                    
                    {(stats?.learningStreak || 0) > 0 && (
                        <div className="absolute inset-0 bg-orange-400/30 blur-md rounded-full animate-ping opacity-20" />
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs md:text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                            Learning Streak
                        </div>
                        {(stats?.learningStreak || 0) >= 7 && (
                            <span className="text-[10px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-md animate-bounce">
                                MASTER
                            </span>
                        )}
                    </div>
                    <div className="text-2xl md:text-3xl font-black flex items-baseline gap-1">
                        <span className={(stats?.learningStreak || 0) > 0 ? 'text-orange-500' : ''}>
                            {stats?.learningStreak || 0}
                        </span>
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
