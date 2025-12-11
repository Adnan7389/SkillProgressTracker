import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { createFieldAttribute } from "better-auth/db";

const client = new MongoClient(process.env.MONGODB_URI!);

// Export client for direct database access in other services
export const mongoClient = client;

export const authOptions = {
  database: mongodbAdapter(client.db()),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  user: {
    enabled: true,
    additionalFields: {
      learningStreak: createFieldAttribute("number", {
        defaultValue: 0,
      }),
      lastActiveDate: createFieldAttribute("string", {
        defaultValue: () => new Date().toISOString().split("T")[0],
      }),
    },
  },

  baseURL: `${process.env.BETTER_AUTH_URL}/api/v1/auth`,
  secret: process.env.BETTER_AUTH_SECRET!,
};

export const auth = betterAuth(authOptions);
