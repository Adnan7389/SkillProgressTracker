import { useState } from 'react';
import { useCreateChapter } from '../../hooks/useChapters';
import { Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Difficulty } from '../../types';

interface AddChapterFormProps {
    pathId: string;
}

export default function AddChapterForm({ pathId }: AddChapterFormProps) {
    const [title, setTitle] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
    const { mutate: createChapter, isPending } = useCreateChapter(pathId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        createChapter({
            learningPathId: pathId,
            title,
            difficulty,
            estimatedMinutes
        }, {
            onSuccess: () => {
                setTitle('');
                setShowOptions(false);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new chapter..."
                        className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] pl-11 shadow-sm"
                    />
                    <Plus className="absolute left-3 top-3.5 w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
                <button
                    type="submit"
                    disabled={!title.trim() || isPending}
                    className="btn-primary px-6 flex items-center justify-center min-w-[100px]"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add'}
                </button>
            </div>

            <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="mt-3 flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
                {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showOptions ? 'Hide Options' : 'More Options'}
            </button>

            {showOptions && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                            Difficulty
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                            className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="easy">🟢 Easy</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="hard">🔴 Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                            Estimated Time (minutes)
                        </label>
                        <input
                            type="number"
                            value={estimatedMinutes}
                            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                            min={5}
                            max={300}
                            className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                </div>
            )}
        </form>
    );
}
