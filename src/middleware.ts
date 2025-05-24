import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET, secureCookie: process.env.NODE_ENV === "production" })
    const pathname = request.nextUrl.pathname

    const protectedRoutes = ["/dashboard", "/playlist"]
    const publicRoutes = ["/login", "/"]

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

    const isAuthenticated = token?.refresh_token

    if (isAuthenticated && isProtectedRoute) {
        return NextResponse.next()
    }

    if (isAuthenticated && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard", "/playlist", "/playlist/:path*", "/login", "/"],
}
