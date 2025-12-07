import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false // Set true in production
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // Update session every 24 hours
    },
    user: {
        additionalFields: {
            learningStreak: {
                type: 'number',
                defaultValue: 0
            },
            lastActiveDate: {
                type: 'string',
                defaultValue: () => new Date().toISOString().split('T')[0]
            }
        }
    },
    baseURL: `${process.env.BETTER_AUTH_URL}/api/v1/auth`,
    secret: process.env.BETTER_AUTH_SECRET!
});
