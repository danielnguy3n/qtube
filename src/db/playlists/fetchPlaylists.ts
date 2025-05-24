"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlists } from "@/db/schema"
import { desc } from "drizzle-orm"

export async function fetchPlaylists() {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        // const response = await db.select().from(playlists).where(eq(playlists.userId, session.user.id))
        const response = await db.query.playlists.findMany({
            where: (playlists, { eq }) => eq(playlists.userId, session.user.id),
            with: {
                items: {
                    orderBy: (items, { asc }) => [asc(items.position)],
                },
            },
            orderBy: [desc(playlists.updatedAt)],
        })

        return response
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to fetch playlist:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}
