import { useState } from 'react';
import { useChallenge, useGenerateChallenge, useSubmitChallengeResponse } from '../../hooks/useChallenges';
import { Zap, Clock, Lightbulb, Send, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';

interface ChallengePanelProps {
    chapterId: string;
}

const difficultyConfig = {
    easy: { label: 'Easy', color: 'bg-green-500/10 text-green-600' },
    medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600' },
    hard: { label: 'Hard', color: 'bg-red-500/10 text-red-600' },
};

export default function ChallengePanel({ chapterId }: ChallengePanelProps) {
    const [showHint, setShowHint] = useState(false);
    const [response, setResponse] = useState('');

    const { data: challenge, isLoading } = useChallenge(chapterId);
    const { mutate: generate, isPending: isGenerating } = useGenerateChallenge(chapterId);
    const { mutate: submitResponse, isPending: isSubmitting } = useSubmitChallengeResponse(chapterId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!response.trim() || !challenge?._id) return;
        submitResponse(
            { challengeId: challenge._id, response },
            { onSuccess: () => setResponse('') },
        );
    };

    if (isLoading) {
        return (
            <div className="mt-4 p-4 bg-[var(--muted)]/20 rounded-xl animate-pulse">
                <div className="h-4 bg-[var(--muted)] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[var(--muted)] rounded w-2/3" />
            </div>
        );
    }

    // No challenge yet — show generate button
    if (!challenge) {
        return (
            <div className="mt-4 border border-dashed border-[var(--border)] rounded-xl p-4 flex items-center justify-between bg-[var(--background)]">
                <div>
                    <h4 className="font-bold text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Mini-Challenge
                    </h4>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        Get a practical task to apply what you've learned
                    </p>
                </div>
                <button
                    onClick={() => generate()}
                    disabled={isGenerating}
                    className="btn-primary py-2 px-5 text-sm font-bold flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4" />
                            Get Challenge
                        </>
                    )}
                </button>
            </div>
        );
    }

    const difficulty = difficultyConfig[challenge.difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium;

    return (
        <div className="mt-4 border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
            {/* Header */}
            <div className="px-4 py-3 bg-amber-500/5 border-b border-[var(--border)] flex items-center justify-between">
                <h4 className="font-bold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Mini-Challenge
                    {challenge.isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                </h4>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficulty.color}`}>
                        {difficulty.label}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {challenge.estimatedMinutes} min
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {/* Task */}
                <div>
                    <p className="text-sm font-medium leading-relaxed">{challenge.task}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        <span className="font-semibold">Objective:</span> {challenge.objective}
                    </p>
                </div>

                {/* Hint toggle */}
                {challenge.hint && (
                    <div>
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-xs text-amber-600 hover:text-amber-500 font-medium flex items-center gap-1 transition-colors"
                        >
                            <Lightbulb className="w-3 h-3" />
                            {showHint ? 'Hide hint' : 'Show hint'}
                        </button>
                        {showHint && (
                            <p className="text-xs text-[var(--muted-foreground)] mt-1 pl-4 border-l-2 border-amber-500/30 italic animate-in fade-in slide-in-from-top-1 duration-200">
                                {challenge.hint}
                            </p>
                        )}
                    </div>
                )}

                {/* Completed response display */}
                {challenge.isCompleted && challenge.userResponse && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-600 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Your Response
                        </p>
                        <p className="text-sm text-[var(--foreground)] whitespace-pre-wrap">{challenge.userResponse}</p>
                    </div>
                )}

                {/* Response form (only when not completed) */}
                {!challenge.isCompleted && (
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response here..."
                            rows={4}
                            maxLength={2000}
                            className="w-full px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--muted-foreground)]">
                                {response.length}/2000
                            </span>
                            <button
                                type="submit"
                                disabled={!response.trim() || isSubmitting}
                                className="btn-primary py-2 px-5 text-sm font-bold flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                Submit Response
                            </button>
                        </div>
                    </form>
                )}

                {/* Regenerate button */}
                {challenge.isCompleted && (
                    <button
                        onClick={() => generate()}
                        disabled={isGenerating}
                        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium flex items-center gap-1 transition-colors"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <RotateCcw className="w-3 h-3" />
                        )}
                        Generate new challenge
                    </button>
                )}
            </div>
        </div>
    );
}
