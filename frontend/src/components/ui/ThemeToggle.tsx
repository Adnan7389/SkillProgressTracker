import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex bg-[var(--card)] border border-[var(--border)] rounded-lg p-1 shadow-sm">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-all duration-200 ${theme === 'light' ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]'}`}
                aria-label="Light theme"
                title="Light Mode"
            >
                <Sun className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition-all duration-200 ${theme === 'dark' ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]'}`}
                aria-label="Dark theme"
                title="Dark Mode"
            >
                <Moon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-md transition-all duration-200 ${theme === 'system' ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]'}`}
                aria-label="System theme"
                title="System Theme"
            >
                <Monitor className="w-4 h-4" />
            </button>
        </div>
    );
}
