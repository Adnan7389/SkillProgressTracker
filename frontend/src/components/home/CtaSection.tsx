import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="py-24 border-t border-[var(--border)]">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <div className="bg-[var(--card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50"></div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Stop Searching. Start Learning.</h2>
                    <p className="text-lg text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto">
                        Generate your first personalized learning path today and build the habits for lifelong mastery.
                    </p>
                    <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-[var(--primary)]/20 inline-flex items-center gap-2">
                        Create Your Free Account <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
