export default function HowItWorksSection() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-20 animate-in md:animate-none md:intersect:animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How Pathwise Works</h2>
                    <p className="text-[var(--muted-foreground)]">From blank slate to structured mastery in four simple steps.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute left-8 top-12 bottom-12 w-px bg-gradient-to-b from-[var(--border)] via-[var(--primary)]/50 to-[var(--border)]"></div>

                    <div className="space-y-12">
                        {/* Step 1 */}
                        <div className="relative flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border shadow-sm border-[var(--border)] flex items-center justify-center shrink-0 z-10 text-[var(--foreground)] font-bold text-xl relative">
                                1
                            </div>
                            <div className="pt-2 md:pt-4">
                                <h3 className="text-2xl font-bold mb-2">Choose a Topic</h3>
                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    Enter any subject you want to learn, from "System Design" to "Basic Italian." Select your current skill level, and let the AI do the heavy context gathering.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] border shadow-sm border-[var(--primary)]/30 flex items-center justify-center shrink-0 z-10 font-bold text-xl relative backdrop-blur-sm">
                                2
                            </div>
                            <div className="pt-2 md:pt-4">
                                <h3 className="text-2xl font-bold mb-2">AI Generates Your Roadmap</h3>
                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    Pathwise creates a highly structured, logical sequence of chapters tailored to your level, complete with time estimates and clear learning objectives.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--card)] border shadow-sm border-[var(--border)] flex items-center justify-center shrink-0 z-10 text-[var(--foreground)] font-bold text-xl relative">
                                3
                            </div>
                            <div className="pt-2 md:pt-4">
                                <h3 className="text-2xl font-bold mb-2">Study with Curated Resources</h3>
                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    No more endless Googling. Each chapter automatically comes with handpicked, high-quality documentation and relevant YouTube video tutorials attached.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border shadow-sm border-amber-500/30 flex items-center justify-center shrink-0 z-10 font-bold text-xl relative backdrop-blur-sm">
                                4
                            </div>
                            <div className="pt-2 md:pt-4">
                                <h3 className="text-2xl font-bold mb-2">Track, Assess, Master</h3>
                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    Mark chapters as complete to maintain your daily streak fire. Verify your new knowledge instantly by taking dynamically generated AI quizzes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
