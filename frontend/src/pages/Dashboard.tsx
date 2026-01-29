import { useSession, signOut } from '../lib/auth-client';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout, Plus, Loader2, BookCopy, FolderOpen, Target } from 'lucide-react';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { useUiStore } from '../store/useUiStore';
import PathCard from '../components/dashboard/PathCard';
import CreatePathForm from '../components/dashboard/CreatePathForm';

export default function Dashboard() {
    const { data: session } = useSession();
    const { data: paths, isLoading } = useLearningPaths();
    const { isCreateModalOpen, setCreateModalOpen } = useUiStore();
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
                <StatsCard icon={Target} label="Next Milestone" value="Day 14" color="text-orange-500" />
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
                        <Layout className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold mb-2">No learning paths yet</h3>
                        <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
                            Ready to start your journey? Create your first learning path and let's get building!
                        </p>
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="btn-primary"
                        >
                            Build First Path
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
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
