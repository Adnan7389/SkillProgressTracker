import { Map, BookOpen, Flame, TrendingUp, BrainCircuit, WifiOff } from 'lucide-react';

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-[var(--card)]/30 border-y border-[var(--border)]/50 relative">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 animate-in md:animate-none md:intersect:animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">The smart way to master new skills</h2>
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">Everything you need to go from beginner to absolute master, curated instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-5">
                            <Map className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">AI Roadmap Generation</h3>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                            Enter a topic and skill level. Get a structured chapter-by-chapter curriculum generated in seconds.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-5">
                            <BookOpen className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Smart Resource Discovery</h3>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                            AI finds and attaches the best documentation and YouTube tutorials for every single chapter automatically.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[var(--card)]/50 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Flame className="w-24 h-24 text-amber-500" />
                        </div>
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 relative z-10">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] relative z-10">Progress & Streaks</h3>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed relative z-10">
                            Visual progress bars and a daily streak system that keeps you accountable and building momentum.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-5">
                            <BrainCircuit className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">AI Assessments</h3>
                        <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                            Test your understanding with dynamically generated, adaptive quizzes after completing each chapter.
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-[var(--card)]/50 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 transition-all duration-300 lg:col-span-2">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-12 h-12 shrink-0 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                                <WifiOff className="w-6 h-6 text-[var(--primary)]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Works Offline Anywhere</h3>
                                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                                    Install Pathwise as a Progressive Web App (PWA) on mobile or desktop. Access your cached roadmaps and continue your journey without an internet connection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
