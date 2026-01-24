import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:5000" // NestJS backend URL
})

export const { signIn, signUp, useSession, signOut } = authClient;
