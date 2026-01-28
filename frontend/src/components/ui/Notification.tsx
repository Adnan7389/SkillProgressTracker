import { useUiStore } from '../../store/useUiStore';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Notification() {
    const { notification } = useUiStore();

    if (!notification) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-right-10 duration-500">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${notification.type === 'success'
                ? 'bg-green-500/10 border-green-500/50 text-green-500'
                : 'bg-red-500/10 border-red-500/50 text-red-500'
                }`}>
                {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-semibold">{notification.message}</span>
            </div>
        </div>
    );
}
