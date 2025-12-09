import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null;
    };
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    };
}
