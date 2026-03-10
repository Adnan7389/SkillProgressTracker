import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  
  MONGODB_URI: z.string().url(),
  DB_NAME: z.string().default("skill-tracker"),
  
  FRONTEND_URL: z.string().url(),
  
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
});

export type Env = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(
      JSON.stringify(result.error.flatten().fieldErrors, null, 2),
    );
    throw new Error("Configuration validation failed");
  }

  return result.data;
}
