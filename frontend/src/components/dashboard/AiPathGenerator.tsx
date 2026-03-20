import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Loader2, Wand2, BookOpen, AlertCircle } from 'lucide-react';
import { useGenerateRoadmap, useJobStatus } from '../../hooks/useAiRecommendation';
import type { SkillLevel } from '../../types';

interface AiPathGeneratorProps {
    onClose: () => void;
}

export default function AiPathGenerator({ onClose }: AiPathGeneratorProps) {
    const [topic, setTopic] = useState('');
    const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
    const [jobId, setJobId] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const { mutate: generateRoadmap, isPending, error: mutationError } = useGenerateRoadmap();
    const { data: jobStatus } = useJobStatus(jobId);
    const navigate = useNavigate();

    useEffect(() => {
        if (jobStatus?.status === 'completed' && jobStatus.result) {
            onClose();
            navigate(`/path/${jobStatus.result.pathId}`);
        } else if (jobStatus?.status === 'failed') {
            setLocalError(jobStatus.error || 'AI Job failed. Please try again.');
            setJobId(null);
        }
    }, [jobStatus, navigate, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        setLocalError(null);

        generateRoadmap({ topic, skillLevel }, {
            onSuccess: (data) => {
                setJobId(data.jobId);
            }
        });
    };

    const isGenerating = isPending || (jobId !== null && jobStatus?.status !== 'failed');
    const displayError = localError || (mutationError as any)?.response?.data?.message;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-white/10 w-fit mx-auto rounded-2xl mb-4 backdrop-blur-md">
                        <Wand2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black">AI Path Generator</h2>
                    <p className="text-purple-100 mt-1 font-medium italic">What do you want to master today?</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            Learning Topic
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Quantum Computing, Web Development, Cooking, etc."
                            className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                            autoFocus
                        />
                        <div className="flex flex-wrap gap-2 mt-4">
                            {[
                                { label: '🧪 Machine Learning', value: 'Machine Learning' },
                                { label: '🎨 UI/UX Design', value: 'UI/UX Design' },
                                { label: '🧠 Public Speaking', value: 'Public Speaking' },
                                { label: '🚀 React Native', value: 'React Native' },
                                { label: '🔋 Sustainable Energy', value: 'Sustainable Energy' }
                            ].map((suggestion) => (
                                <button
                                    key={suggestion.value}
                                    type="button"
                                    onClick={() => setTopic(suggestion.value)}
                                    className="px-3 py-1.5 text-xs font-bold bg-[var(--muted)] hover:bg-purple-100 dark:hover:bg-purple-900/30 text-[var(--muted-foreground)] hover:text-purple-600 rounded-full transition-all border border-transparent hover:border-purple-200"
                                >
                                    {suggestion.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
                            Starting Skill Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setSkillLevel(level)}
                                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all capitalize border ${skillLevel === level
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 scale-[1.02]'
                                            : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-purple-300'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {displayError && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in head-shake">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium">{displayError || 'AI generation failed. Please try again.'}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!topic.trim() || isGenerating}
                        className="w-full btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 flex items-center justify-center gap-3 py-4 text-lg shadow-xl shadow-purple-500/30 disabled:opacity-70 disabled:grayscale transition-all"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>
                                    {jobStatus?.status === 'active'
                                        ? `Generating... ${jobStatus.progress}%`
                                        : jobStatus?.status === 'waiting'
                                        ? 'Waiting in queue...'
                                        : 'Designing Roadmap...'}
                                </span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6" />
                                <span>Generate Learning Path</span>
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-[var(--muted-foreground)] uppercase tracking-[0.2em] font-black opacity-50">
                        Crafted by SkillGPT • {skillLevel} Roadmaps
                    </p>
                </form>
            </div>
        </div>
    );
}
