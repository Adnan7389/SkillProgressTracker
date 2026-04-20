import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function HomeNav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-6xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                        <Sparkles className="w-5 h-5 text-[var(--primary-foreground)]" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pathwise</span>
                </div>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <Link to="/login" className="hidden sm:block text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="btn-primary flex items-center gap-2 shadow-lg shadow-[var(--primary)]/10 text-sm">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
