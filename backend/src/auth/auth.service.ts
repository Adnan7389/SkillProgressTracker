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
  trustedOrigins: [process.env.FRONTEND_URL!],

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
      timezone: createFieldAttribute("string", {
        defaultValue: "UTC",
      }),
      reminderHour: createFieldAttribute("number", {
        defaultValue: 18,
      }),
      lastReminderSentAt: createFieldAttribute("string", {
        defaultValue: "",
      }),
    },
  },

  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,

  advanced: {
    defaultCookieAttributes: {
      sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
};

export const auth = betterAuth(authOptions);
