import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Abstract Background Grid/Glow */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="absolute w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium mb-8">
                    <Sparkles className="w-4 h-4" />
                    <span>Smarter learning powered by Gemini AI</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-[var(--foreground)]">
                    Learn Anything. <br className="hidden sm:block" />
                    <span className="text-[var(--primary)] sm:ml-3">Guided by AI.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto leading-relaxed">
                    Enter any topic. Pathwise generates a structured roadmap with curated resources, progress tracking, and AI assessments to ensure mastery.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="btn-primary w-full sm:w-auto text-lg px-8 py-3.5 shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-2">
                        Get Started Free <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto text-lg px-8 py-3.5 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card)] hover:border-[var(--primary)]/50 transition-all font-medium flex items-center justify-center">
                        Sign In
                    </Link>
                </div>
            </div>
        </section>
    );
}
