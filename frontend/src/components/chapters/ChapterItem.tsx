import { useState } from 'react';
import { useToggleChapter, useUpdateChapter, useDeleteChapter } from '../../hooks/useChapters';
import type { Chapter } from '../../types';
import { Check, Edit2, Trash2, X, Save } from 'lucide-react';

interface ChapterItemProps {
    chapter: Chapter;
}

export default function ChapterItem({ chapter }: ChapterItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chapter.title);

    const { mutate: toggleChapter } = useToggleChapter(chapter.learningPathId);
    const { mutate: updateChapter, isPending: isUpdating } = useUpdateChapter(chapter.learningPathId);
    const { mutate: deleteChapter, isPending: isDeleting } = useDeleteChapter(chapter.learningPathId);

    const handleToggle = () => {
        toggleChapter({ id: chapter._id, isCompleted: !chapter.isCompleted });
    };

    const handleSave = () => {
        if (editTitle.trim() !== chapter.title) {
            updateChapter({ id: chapter._id, data: { title: editTitle } });
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this chapter?')) {
            deleteChapter(chapter._id);
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-3 p-4 bg-[var(--muted)]/50 rounded-xl animate-in fade-in">
                <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') setIsEditing(false);
                    }}
                />
                <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:brightness-110"
                >
                    <Save className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-[var(--muted)] text-[var(--muted-foreground)] rounded-lg hover:bg-[var(--muted)]/80"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className={`group flex items-center justify-between p-4 rounded-xl border border-[var(--border)] transition-all hover:shadow-md ${chapter.isCompleted ? 'bg-[var(--primary)]/5 border-[var(--primary)]/20' : 'bg-[var(--card)]'
            }`}>
            <div className="flex items-center gap-4 flex-1">
                <div
                    onClick={handleToggle}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${chapter.isCompleted
                            ? 'bg-[var(--primary)] border-[var(--primary)]'
                            : 'border-[var(--muted-foreground)] hover:border-[var(--primary)]'
                        }`}
                >
                    {chapter.isCompleted && <Check className="w-4 h-4 text-[var(--primary-foreground)]" />}
                </div>

                <span className={`font-medium transition-all ${chapter.isCompleted
                        ? 'text-[var(--muted-foreground)] line-through decoration-2 decoration-[var(--primary)]/30'
                        : 'text-[var(--foreground)]'
                    }`}>
                    {chapter.title}
                </span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
