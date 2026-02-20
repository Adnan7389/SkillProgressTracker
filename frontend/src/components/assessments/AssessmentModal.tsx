import { useState } from 'react';
import { X, Trophy, Loader2, PlayCircle, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { useAssessment, useSubmitAssessment } from '../../hooks/useAssessments';
import type { AssessmentResult } from '../../types';
import MCQDisplay from './MCQDisplay';

interface AssessmentModalProps {
    chapterId: string;
    chapterTitle: string;
    onClose: () => void;
}

export default function AssessmentModal({ chapterId, chapterTitle, onClose }: AssessmentModalProps) {
    const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'result'>('welcome');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<AssessmentResult | null>(null);

    const generateAssessment = useAssessment(chapterId);
    const submitAssessment = useSubmitAssessment(chapterId);

    const handleStart = async () => {
        try {
            const assessment = await generateAssessment.mutateAsync();
            setAnswers(new Array(assessment.questions.length).fill(-1));
            setCurrentStep('quiz');
        } catch (error) {
            console.error('Failed to generate assessment', error);
        }
    };

    const handleSelect = (index: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = index;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIndex < (generateAssessment.data?.questions.length || 0) - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!generateAssessment.data) return;
        try {
            const resultData = await submitAssessment.mutateAsync({
                assessmentId: generateAssessment.data._id,
                answers,
            });
            setResult(resultData);
            setCurrentStep('result');
        } catch (error) {
            console.error('Failed to submit assessment', error);
        }
    };

    const currentQuestion = generateAssessment.data?.questions[currentIndex];
    const isLastQuestion = currentIndex === (generateAssessment.data?.questions.length || 0) - 1;
    const canSubmit = answers.every((a: number) => a !== -1);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--card)] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            AI Assessment
                        </h2>
                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{chapterTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    {currentStep === 'welcome' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <PlayCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black mb-3">Ready to test your knowledge?</h3>
                            <p className="text-[var(--muted-foreground)] max-w-md mx-auto mb-8 font-medium">
                                We'll generate 3-5 unique questions based on this chapter. Prove your mastery!
                            </p>
                            <button
                                onClick={handleStart}
                                disabled={generateAssessment.isPending}
                                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                            >
                                {generateAssessment.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Quiz...
                                    </>
                                ) : (
                                    <>
                                        Start Assessment
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {currentStep === 'quiz' && currentQuestion && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            {/* Progress Bar */}
                            <div className="flex items-center justify-between gap-4 mb-2">
                                <span className="text-sm font-bold text-[var(--primary)]">
                                    Question {currentIndex + 1} of {generateAssessment.data?.questions.length}
                                </span>
                                <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--primary)] transition-all duration-500"
                                        style={{ width: `${((currentIndex + 1) / (generateAssessment.data?.questions.length || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <MCQDisplay
                                question={currentQuestion.question}
                                options={currentQuestion.options}
                                selectedIndex={answers[currentIndex]}
                                onSelect={handleSelect}
                            />

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-6">
                                <button
                                    onClick={handleBack}
                                    disabled={currentIndex === 0}
                                    className="px-6 py-2 rounded-xl font-bold border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-30 flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Back
                                </button>

                                {isLastQuestion ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!canSubmit || submitAssessment.isPending}
                                        className="btn-primary px-8 py-2 font-bold flex items-center gap-2"
                                    >
                                        {submitAssessment.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>Submit Assessment <Trophy className="w-5 h-5" /></>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={answers[currentIndex] === -1}
                                        className="btn-primary px-8 py-2 font-bold flex items-center gap-2"
                                    >
                                        Next <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 'result' && result && (
                        <div className="animate-in zoom-in-95 duration-500">
                            <div className="text-center mb-8">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${result.score >= 70 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <Trophy className="w-12 h-12" />
                                </div>
                                <h3 className="text-3xl font-black mb-2">
                                    {result.score >= 70 ? 'Well Done!' : 'Keep Learning!'}
                                </h3>
                                <div className="text-5xl font-black mb-4 flex items-center justify-center gap-2">
                                    {result.score}
                                    <span className="text-xl text-[var(--muted-foreground)] font-bold">%</span>
                                </div>
                                <p className="text-[var(--muted-foreground)] font-medium">
                                    You got {result.correctAnswers} out of {result.totalQuestions} questions correct.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {generateAssessment.data?.questions.map((q, i) => (
                                    <div key={i} className="pt-8 border-t border-[var(--border)]">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${result.feedback[i].isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {i + 1}
                                            </span>
                                            <span className={`font-bold ${result.feedback[i].isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                                {result.feedback[i].isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                                            </span>
                                        </div>
                                        <MCQDisplay
                                            question={q.question}
                                            options={q.options}
                                            selectedIndex={answers[i]}
                                            onSelect={() => { }}
                                            showResult={true}
                                            correctAnswer={q.answer}
                                            explanation={q.explanation}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button
                                    onClick={() => {
                                        setCurrentStep('welcome');
                                        setCurrentIndex(0);
                                        setResult(null);
                                    }}
                                    className="flex-1 py-4 border-2 border-[var(--border)] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-colors"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Retry Quiz
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 btn-primary py-4 text-lg font-bold rounded-2xl"
                                >
                                    Finish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
