import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../lib/auth-client';
import { Sparkles } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signUp.email({
                email,
                password,
                name,
                callbackURL: "/dashboard"
            }, {
                onSuccess: () => {
                    navigate('/dashboard');
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'Registration failed');
                }
            });
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-2xl">
            <div className="flex flex-col items-center justify-center mb-8">
                <Link to="/" className="flex items-center justify-center mb-4 transition-transform hover:scale-105">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                            <Sparkles className="w-5 h-5 text-[var(--primary-foreground)]" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pathwise</span>
                    </div>
                </Link>
                <h1 className="text-2xl font-bold">Create Account</h1>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary mb-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 mt-4"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="mt-6 text-center text-secondary text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
