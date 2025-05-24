import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        error?: "RefreshTokenError"
        user: {
            id: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string
        access_token: string
        expires_at: number
        refresh_token?: string
        error?: "RefreshTokenError"
    }
}
