import { useSession, signOut } from '../lib/auth-client';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout, Plus, Loader2, BookCopy, FolderOpen, Flame, Sparkles } from 'lucide-react';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { useUiStore } from '../store/ui.store';
import PathCard from '../components/dashboard/PathCard';
import CreatePathForm from '../components/dashboard/CreatePathForm';
import AiPathGenerator from '../components/dashboard/AiPathGenerator';
import { useState } from 'react';

export default function Dashboard() {
    const { data: session } = useSession();
    const { data: paths, isLoading } = useLearningPaths();
    const { isCreateModalOpen, setCreateModalOpen } = useUiStore();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const totalProgress = paths?.length
        ? Math.round(paths.reduce((acc, p) => acc + p.progress, 0) / paths.length)
        : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isCreateModalOpen && <CreatePathForm />}
            {isAiModalOpen && <AiPathGenerator onClose={() => setIsAiModalOpen(false)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        Welcome back, <span className="text-[var(--primary)]">{session?.user?.name || 'Explorer'}</span>!
                    </h1>
                    <p className="text-[var(--muted-foreground)] text-lg">
                        Track your progress and conquer new skills.
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsAiModalOpen(true)}
                        className="btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-0 flex-1 md:flex-none flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate with AI
                    </button>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Path
                    </button>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Sign Out</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard icon={BookCopy} label="Overall Progress" value={`${totalProgress}%`} color="text-blue-500" />
                <StatsCard icon={FolderOpen} label="Total Paths" value={paths?.length.toString() || '0'} color="text-purple-500" />
                <StatsCard icon={Flame} label="Learning Streak" value={`${(session?.user as { learningStreak?: number })?.learningStreak || 0} days`} color="text-orange-500" />
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Layout className="w-6 h-6 text-[var(--primary)]" />
                        Learning Paths
                    </h2>
                    <span className="text-sm font-semibold text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
                        {paths?.length || 0} Total
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
                        <p className="text-[var(--muted-foreground)] font-medium">Fetching your learning paths...</p>
                    </div>
                ) : paths?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paths.map(path => (
                            <PathCard key={path._id} path={path} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--card)] rounded-3xl border-2 border-dashed border-[var(--border)]">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <Layout className="w-full h-full text-[var(--muted-foreground)] opacity-20" />
                            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-purple-500 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black mb-2">No learning paths yet</h3>
                        <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto font-medium">
                            Ready to start your journey? Build it manually or let the AI design a perfect roadmap for you.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setIsAiModalOpen(true)}
                                className="btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-0 px-8 py-3 flex items-center gap-2 shadow-xl shadow-purple-500/20 w-full md:w-auto"
                            >
                                <Sparkles className="w-5 h-5" />
                                Generate with AI
                            </button>
                            <button
                                onClick={() => setCreateModalOpen(true)}
                                className="btn-secondary px-8 py-3 w-full md:w-auto"
                            >
                                Build Manually
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, color }: { icon: React.ElementType, label: string, value: string, color: string }) {
    return (
        <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center gap-5 hover:border-[var(--primary)] transition-colors group">
            <div className={`p-4 bg-[var(--background)] rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <div>
                <div className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{label}</div>
                <div className="text-3xl font-black">{value}</div>
            </div>
        </div>
    );
}
