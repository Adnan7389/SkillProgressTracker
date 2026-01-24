import { useSession, signOut } from '../lib/auth-client';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Activity, BookOpen } from 'lucide-react';

export default function Dashboard() {
    const { data: session } = useSession();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
                    <p className="text-secondary">Here's your progress overview.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-slate-800 border border-slate-700 rounded-lg text-secondary hover:text-white transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard icon={Activity} label="Learning Streak" value="7 Days" />
                <StatsCard icon={BookOpen} label="Total Paths" value="3 Active" />
                <StatsCard icon={User} label="Profile Status" value="Learner" />
            </div>

            <div className="p-8 bg-card border border-slate-800 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="text-secondary italic">Stay tuned! Your learning history will appear here.</div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="p-6 bg-card border border-slate-800 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <div className="text-sm text-secondary uppercase font-semibold tracking-wider">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
}
