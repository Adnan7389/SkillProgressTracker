import { useState } from 'react';
import { useCreateLearningPath } from '../../hooks/useLearningPaths';
import { useUiStore } from '../../store/useUiStore';
import { X, Loader2, Sparkles } from 'lucide-react';

export default function CreatePathForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [skillLevel, setSkillLevel] = useState('beginner');

    const { setCreateModalOpen, setNotification } = useUiStore();
    const { mutate: createPath, isPending } = useCreateLearningPath();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPath({ name, description, skillLevel: skillLevel as any }, {
            onSuccess: () => {
                setNotification({ message: 'Learning path created successfully!', type: 'success' });
                setCreateModalOpen(false);
                setName('');
                setDescription('');
            },
            onError: (error: any) => {
                setNotification({ message: error.response?.data?.message || 'Failed to create path', type: 'error' });
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--card)] w-full max-w-lg rounded-2xl border border-[var(--border)] shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={() => setCreateModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <h2 className="text-2xl font-bold">New Learning Path</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Path Name</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="e.g. Master React & TypeScript"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field min-h-[100px]"
                                placeholder="What motivated you to start this path?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Target Skill Level</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['beginner', 'intermediate', 'advanced'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setSkillLevel(level)}
                                        className={`py-2 px-3 rounded-lg border font-medium text-sm capitalize transition-all ${skillLevel === level
                                                ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]'
                                                : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setCreateModalOpen(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || !name}
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Path'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
