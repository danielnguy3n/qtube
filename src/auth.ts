import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { type JWT } from "next-auth/jwt"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/youtube.readonly",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    // Fixed by clearing cookies
    secret: process.env.AUTH_SECRET,
    adapter: DrizzleAdapter(db),
    callbacks: {
        async jwt({ token, account }) {
            // console.log({ token, account })
            if (account) {
                // First-time login, save the `access_token`, its expiry and the `refresh_token`
                return {
                    ...token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    refresh_token: account.refresh_token,
                } as JWT
            } else if (Date.now() < token.expires_at * 1000) {
                // Subsequent logins, but the `access_token` is still valid
                return token
            } else {
                // Subsequent logins, but the `access_token` has expired, try to refresh it
                if (!token.refresh_token) throw new TypeError("Missing refresh_token")

                try {
                    const response = await fetch("https://oauth2.googleapis.com/token", {
                        method: "POST",
                        body: new URLSearchParams({
                            client_id: process.env.AUTH_GOOGLE_ID!,
                            client_secret: process.env.AUTH_GOOGLE_SECRET!,
                            grant_type: "refresh_token",
                            refresh_token: token.refresh_token,
                        }),
                    })

                    const tokensOrError = await response.json()

                    if (!response.ok) throw tokensOrError

                    const newTokens = tokensOrError as {
                        access_token: string
                        expires_in: number
                        refresh_token?: string
                    }

                    return {
                        ...token,
                        access_token: newTokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                        // Some providers only issue refresh tokens once, so preserve if we did not get a new one
                        refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
                    }
                } catch (error) {
                    console.error("Error refreshing access_token", error)
                    // If we fail to refresh the token, return an error so we can handle it on the page
                    token.error = "RefreshTokenError"
                    return token
                }
            }
        },
        async session({ session, token }) {
            // console.log({ token, session })

            session.accessToken = token.access_token as string
            session.error = token.error
            session.user.id = token.sub
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
})
