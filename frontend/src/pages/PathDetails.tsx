import { useParams, useNavigate } from 'react-router-dom';
import { useLearningPath } from '../hooks/useLearningPaths';
import { useChapters } from '../hooks/useChapters';
import { ArrowLeft, Loader2, LayoutList } from 'lucide-react';
import ChapterItem from '../components/chapters/ChapterItem';
import AddChapterForm from '../components/chapters/AddChapterForm';
import AiPanel from '../components/dashboard/AiPanel';

export default function PathDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: path, isLoading: isLoadingPath } = useLearningPath(id!);
    const { data: chapters, isLoading: isLoadingChapters } = useChapters(id!);

    if (isLoadingPath || isLoadingChapters) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
            </div>
        );
    }

    if (!path) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Path not found</h2>
                <button onClick={() => navigate('/dashboard')} className="btn-primary">Go Home</button>
            </div>
        );
    }

    // Calculate local progress in case query hasn't invalidated yet
    // But we rely on server invalidation.

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate('/dashboard')}
                className="mb-6 flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors font-medium"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Content: Header & Chapters */}
                <div className="flex-1 w-full space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${path.skillLevel === 'beginner' ? 'bg-green-500/10 text-green-500' :
                                    path.skillLevel === 'intermediate' ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-purple-500/10 text-purple-500'
                                }`}>
                                {path.skillLevel}
                            </span>
                            <span className="text-sm font-semibold text-[var(--muted-foreground)]">
                                {path.progress}% Completed
                            </span>
                        </div>
                        <h1 className="text-4xl font-black mb-4">{path.name}</h1>
                        {path.description && (
                            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                                {path.description}
                            </p>
                        )}

                        <div className="h-3 bg-[var(--muted)] rounded-full mt-6 overflow-hidden">
                            <div
                                className="h-full bg-[var(--primary)] transition-all duration-1000 ease-out"
                                style={{ width: `${path.progress}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <LayoutList className="w-6 h-6 text-[var(--primary)]" />
                                Chapters
                            </h2>
                            <span className="bg-[var(--muted)] px-3 py-1 rounded-full font-bold text-sm">
                                {chapters?.length || 0}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {chapters?.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--background)]">
                                    <p className="text-[var(--muted-foreground)] mb-2">This path is empty.</p>
                                    <p className="font-medium">Start by adding your first chapter below!</p>
                                </div>
                            ) : (
                                chapters?.map(chapter => (
                                    <ChapterItem key={chapter._id} chapter={chapter} />
                                ))
                            )}
                        </div>

                        <AddChapterForm pathId={path._id} />
                    </div>
                </div>

                {/* Sidebar: AI */}
                <div className="w-full lg:w-[350px] shrink-0">
                    <AiPanel pathId={path._id} />
                </div>
            </div>
        </div>
    );
}
