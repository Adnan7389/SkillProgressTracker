import { CheckCircle2, Circle } from 'lucide-react';

interface MCQDisplayProps {
    question: string;
    options: string[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
    showResult?: boolean;
    correctAnswer?: number;
    explanation?: string;
}

export default function MCQDisplay({
    question,
    options,
    selectedIndex,
    onSelect,
    showResult,
    correctAnswer,
    explanation,
}: MCQDisplayProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold leading-tight">{question}</h3>

            <div className="grid gap-3">
                {options.map((option, index) => {
                    const isSelected = selectedIndex === index;
                    const isCorrect = correctAnswer === index;
                    const isWrong = isSelected && !isCorrect;

                    let variantClass = "border-[var(--border)] hover:border-[var(--primary)] bg-[var(--background)]";
                    if (showResult) {
                        if (isCorrect) variantClass = "border-green-500 bg-green-500/10";
                        else if (isWrong) variantClass = "border-red-500 bg-red-500/10";
                        else variantClass = "border-[var(--border)] opacity-60";
                    } else if (isSelected) {
                        variantClass = "border-[var(--primary)] bg-[var(--primary)]/5";
                    }

                    return (
                        <button
                            key={index}
                            disabled={showResult}
                            onClick={() => onSelect(index)}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all group ${variantClass}`}
                        >
                            <div className="shrink-0">
                                {showResult ? (
                                    isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-500" /> :
                                        isSelected ? <Circle className="w-6 h-6 text-red-500" /> :
                                            <Circle className="w-6 h-6 text-[var(--muted-foreground)]" />
                                ) : (
                                    isSelected ? <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" /> :
                                        <Circle className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                                )}
                            </div>
                            <span className="font-medium text-lg">{option}</span>
                        </button>
                    );
                })}
            </div>

            {showResult && explanation && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-500">
                    <p className="text-sm font-bold mb-1 flex items-center gap-2">
                        💡 Explanation:
                    </p>
                    <p className="leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
    );
}
