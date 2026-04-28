import { Github } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';

export default function HomeFooter() {
    return (
        <footer className="py-8 border-t border-[var(--border)] bg-[var(--background)]">
            <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center shadow-sm">
                        <BrandLogo className="text-[var(--primary-foreground)]" size={14} />
                    </div>
                    <span className="font-semibold text-[var(--foreground)]">Pathwise</span>
                    <span className="text-sm text-[var(--muted-foreground)] ml-2">© 2026</span>
                </div>

                <div className="text-sm text-[var(--muted-foreground)] text-center">
                    Built with <span className="font-medium text-[var(--foreground)]">NestJS, React, MongoDB, & Gemini AI</span>
                </div>

                <a
                    href="https://github.com/Adnan7389/SkillProgressTracker"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <Github className="w-4 h-4" />
                    View Source
                </a>
            </div>
        </footer>
    );
}
