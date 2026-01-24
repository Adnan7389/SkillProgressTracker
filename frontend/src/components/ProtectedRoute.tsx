import { Navigate } from 'react-router-dom';
import { useSession } from '../lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-secondary font-medium">Verifying session...</p>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
