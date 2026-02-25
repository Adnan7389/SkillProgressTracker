import { useState } from 'react';
import { useToggleChapter, useUpdateChapter, useDeleteChapter, useAddChapterNote, useDiscoverResources, useRefreshResources } from '../../hooks/useChapters';
import type { Chapter } from '../../types';
import { Check, Edit2, Trash2, X, Save, ChevronDown, ChevronUp, Clock, StickyNote, Send, BookOpen, BrainCircuit } from 'lucide-react';
import ResourceList from './ResourceList';
import ChallengePanel from './ChallengePanel';
import AssessmentModal from '../assessments/AssessmentModal';

interface ChapterItemProps {
    chapter: Chapter;
}

const difficultyConfig = {
    easy: { label: 'Easy', color: 'bg-green-500/10 text-green-600' },
    medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600' },
    hard: { label: 'Hard', color: 'bg-red-500/10 text-red-600' },
};

export default function ChapterItem({ chapter }: ChapterItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(chapter.title);
    const [isExpanded, setIsExpanded] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    const { mutate: toggleChapter } = useToggleChapter(chapter.learningPathId);
    const { mutate: updateChapter, isPending: isUpdating } = useUpdateChapter(chapter.learningPathId);
    const { mutate: deleteChapter, isPending: isDeleting } = useDeleteChapter(chapter.learningPathId);
    const { mutate: addNote, isPending: isAddingNote } = useAddChapterNote(chapter.learningPathId);
    const { mutate: discoverResources, isPending: isDiscovering } = useDiscoverResources(chapter.learningPathId);
    const { mutate: refreshResourcesMut, isPending: isRefreshing } = useRefreshResources(chapter.learningPathId);

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

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        addNote({ chapterId: chapter._id, text: newNote }, {
            onSuccess: () => setNewNote('')
        });
    };

    const difficulty = difficultyConfig[chapter.difficulty] || difficultyConfig.medium;

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
        <div className={`rounded-xl border border-[var(--border)] transition-all hover:shadow-md ${chapter.isCompleted ? 'bg-[var(--primary)]/5 border-[var(--primary)]/20' : 'bg-[var(--card)]'}`}>
            {/* Main Row */}
            <div className="group flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                    <div
                        onClick={handleToggle}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${chapter.isCompleted
                            ? 'bg-[var(--primary)] border-[var(--primary)]'
                            : 'border-[var(--muted-foreground)] hover:border-[var(--primary)]'
                            }`}
                    >
                        {chapter.isCompleted && <Check className="w-4 h-4 text-[var(--primary-foreground)]" />}
                    </div>

                    <div className="flex-1">
                        <span className={`font-medium transition-all ${chapter.isCompleted
                            ? 'text-[var(--muted-foreground)] line-through decoration-2 decoration-[var(--primary)]/30'
                            : 'text-[var(--foreground)]'
                            }`}>
                            {chapter.title}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                                {difficulty.label}
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {chapter.estimatedMinutes} min
                            </span>
                            {chapter.notes?.length > 0 && (
                                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                                    <StickyNote className="w-3 h-3" />
                                    {chapter.notes.length}
                                </span>
                            )}
                            {chapter.resources?.length > 0 && (
                                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {chapter.resources.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50 rounded-lg transition-colors"
                        title="Details"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-2 duration-200">
                    {chapter.description && (
                        <p className="text-sm text-[var(--muted-foreground)] mt-3 mb-4">{chapter.description}</p>
                    )}

                    <ResourceList
                        resources={chapter.resources || []}
                        resourceStatus={chapter.resourceStatus || 'pending'}
                        onDiscover={() => discoverResources(chapter._id)}
                        onRefresh={() => refreshResourcesMut(chapter._id)}
                        isDiscovering={isDiscovering || isRefreshing}
                    />

                    <ChallengePanel chapterId={chapter._id} />

                    <div className="mt-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Notes</h4>
                        {chapter.notes?.length > 0 ? (
                            <ul className="space-y-2 mb-3">
                                {chapter.notes.map((note, idx) => (
                                    <li key={idx} className="text-sm bg-[var(--muted)]/30 p-2 rounded-lg">
                                        {note.text}
                                        <span className="block text-xs text-[var(--muted-foreground)] mt-1">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-[var(--muted-foreground)] mb-3">No notes yet.</p>
                        )}

                        <form onSubmit={handleAddNote} className="flex gap-2">
                            <input
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a quick note..."
                                className="flex-1 px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                            <button
                                type="submit"
                                disabled={!newNote.trim() || isAddingNote}
                                className="p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:brightness-110 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {chapter.isCompleted && (
                        <div className="mt-6 border-t border-[var(--border)] pt-4 flex items-center justify-between bg-[var(--muted)]/20 p-4 rounded-xl">
                            <div>
                                <h4 className="font-bold">Test your knowledge</h4>
                                <p className="text-sm text-[var(--muted-foreground)]">Generate an AI-powered quiz to verify understanding.</p>
                            </div>
                            <button
                                onClick={() => setIsQuizOpen(true)}
                                className="btn-primary py-2 px-6 font-bold flex items-center gap-2"
                            >
                                <BrainCircuit className="w-4 h-4" />
                                Take Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isQuizOpen && (
                <AssessmentModal
                    chapterId={chapter._id}
                    chapterTitle={chapter.title}
                    onClose={() => setIsQuizOpen(false)}
                />
            )}
        </div>
    );
}
