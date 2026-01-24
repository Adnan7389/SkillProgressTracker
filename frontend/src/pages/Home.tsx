import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <div className="p-4 bg-primary/20 rounded-full mb-6">
                <Rocket className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                Master Your Skills
            </h1>
            <p className="text-xl text-secondary max-w-2xl mb-8">
                Track your progress, build learning paths, and stay motivated with our progress tracker.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/register"
                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all"
                >
                    Get Started
                </Link>
                <Link
                    to="/login"
                    className="px-8 py-3 bg-card hover:bg-card/80 text-foreground font-semibold rounded-lg border border-slate-700 transition-all"
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
}
