import { useAiRecommendation } from '../../hooks/useAiRecommendation';
import { Sparkles, Loader2, Lightbulb, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface AiPanelProps {
    pathId: string;
}

export default function AiPanel({ pathId }: AiPanelProps) {
    const { mutate: getRecommendation, isPending, data } = useAiRecommendation();
    const [hasFetched, setHasFetched] = useState(false);

    const handleGetAdvice = () => {
        setHasFetched(true);
        getRecommendation(pathId);
    };

    return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        AI Mentor
                    </h2>
                    <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                        Powered by Gemini
                    </p>
                </div>
            </div>

            {!hasFetched ? (
                <div className="text-center py-8">
                    <p className="text-[var(--muted-foreground)] mb-6 text-sm">
                        Stuck? Not sure what to focus on next? Let the AI analyze your progress and suggest the best next step.
                    </p>
                    <button
                        onClick={handleGetAdvice}
                        className="w-full btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 flex items-center justify-center gap-2 py-3 shadow-lg shadow-purple-500/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        Get Personalized Advice
                    </button>
                </div>
            ) : isPending ? (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin relative z-10" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-purple-600 animate-pulse">
                        Analyzing your chapters...
                    </p>
                </div>
            ) : data ? (
                <div className="animate-in zoom-in-95 duration-300">
                    <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded-r-lg mb-4">
                        <h3 className="font-bold text-purple-700 mb-1 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Suggested Focus
                        </h3>
                        <p className="text-lg font-black text-[var(--foreground)]">
                            {data.nextChapterTitle}
                        </p>
                    </div>

                    <div className="prose prose-sm text-[var(--muted-foreground)] mb-6">
                        <p>{data.reason}</p>
                    </div>

                    <button
                        onClick={handleGetAdvice}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-purple-600 transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Refresh Analysis
                    </button>
                </div>
            ) : (
                <div className="text-center py-8 text-red-500">
                    <p>Failed to get advice. Please try again.</p>
                    <button
                        onClick={handleGetAdvice}
                        className="mt-4 btn-secondary text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}
