import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../lib/auth-client';
import BrandLogo from '../components/ui/BrandLogo';

export default function Login() {
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
            await signIn.email({
                email,
                password,
                callbackURL: "/dashboard"
            }, {
                onSuccess: () => {
                    navigate('/dashboard');
                },
                onError: (ctx) => {
                    setError(ctx.error.message || 'Login failed');
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
                            <BrandLogo className="text-[var(--primary-foreground)]" size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pathwise</span>
                    </div>
                </Link>
                <h1 className="text-2xl font-bold">Welcome Back</h1>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-center text-secondary text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    );
}
