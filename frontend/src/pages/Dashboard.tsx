import { useSession, signOut } from '../lib/auth-client';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout, Plus, Loader2, Sparkles } from 'lucide-react';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useUiStore } from '../store/ui.store';
import PathCard from '../components/dashboard/PathCard';
import CreatePathForm from '../components/dashboard/CreatePathForm';
import AiPathGenerator from '../components/dashboard/AiPathGenerator';
import StatsOverview from '../components/dashboard/StatsOverview';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const { data: session } = useSession();
    const { data: paths, isLoading: isPathsLoading } = useLearningPaths();
    const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
    const { isCreateModalOpen, setCreateModalOpen, hasSeenOnboarding, setHasSeenOnboarding } = useUiStore();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Trigger tour if user is new, has no paths, and hasn't seen onboarding yet
        if (!isPathsLoading && paths && paths.length === 0 && !hasSeenOnboarding) {
            setShowTour(true);
        }
    }, [isPathsLoading, paths, hasSeenOnboarding]);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const handleTourNext = () => {
        if (tourStep < 1) {
            setTourStep(prev => prev + 1);
        } else {
            setShowTour(false);
            setHasSeenOnboarding(true);
        }
    };

    const handleTourSkip = () => {
        setShowTour(false);
        setHasSeenOnboarding(true);
    };


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

            <StatsOverview stats={stats} isLoading={isStatsLoading} />

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

                {isPathsLoading ? (
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

            {showTour && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--background)]/20 backdrop-blur-[2px] animate-in fade-in duration-500">
                    <div className="relative max-w-sm w-full bg-[var(--card)] border-2 border-purple-500/50 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 animate-in zoom-in-95 duration-300">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl">
                            <Sparkles className="w-12 h-12 animate-pulse" />
                        </div>

                        <div className="mt-8 text-center">
                            {tourStep === 0 ? (
                                <div className="animate-in slide-in-from-right-4">
                                    <h3 className="text-2xl font-black mb-3 italic">Generate with AI</h3>
                                    <p className="text-[var(--muted-foreground)] mb-8 font-medium leading-relaxed">
                                        Type any topic—from "Quantum Physics" to "Spanish Cooking"—and our AI will craft a personalized roadmap just for you.
                                    </p>
                                </div>
                            ) : (
                                <div className="animate-in slide-in-from-right-4">
                                    <h3 className="text-2xl font-black mb-3 italic">Track Your Mastery</h3>
                                    <p className="text-[var(--muted-foreground)] mb-8 font-medium leading-relaxed">
                                        Monitor your streaks and skill levels right here. Every chapter completed brings you closer to mastery.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={handleTourSkip}
                                    className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-4"
                                >
                                    Skip Tour
                                </button>
                                <button
                                    onClick={handleTourNext}
                                    className="btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 border-0 px-8 py-3 flex-1 shadow-lg shadow-purple-500/20"
                                >
                                    {tourStep === 0 ? 'Next' : 'Got it!'}
                                </button>
                            </div>

                            <div className="flex justify-center gap-2 mt-8">
                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${tourStep === 0 ? 'w-8 bg-purple-500' : 'bg-[var(--border)]'}`} />
                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${tourStep === 1 ? 'w-8 bg-purple-500' : 'bg-[var(--border)]'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

