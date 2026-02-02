import { useState } from 'react';
import { useCreateChapter } from '../../hooks/useChapters';
import { Plus, Loader2 } from 'lucide-react';

interface AddChapterFormProps {
    pathId: string;
}

export default function AddChapterForm({ pathId }: AddChapterFormProps) {
    const [title, setTitle] = useState('');
    const { mutate: createChapter, isPending } = useCreateChapter(pathId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        createChapter({ learningPathId: pathId, title }, {
            onSuccess: () => setTitle('')
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
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
        </form>
    );
}
