"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlists } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function deletePlaylist(playlistId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        await db.delete(playlists).where(eq(playlists.id, playlistId))
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to delete playlist:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}
