"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlists } from "@/db/schema"
import { eq, InferSelectModel } from "drizzle-orm"

export type PlaylistItemSchema = InferSelectModel<typeof playlists>

export async function updatePlaylist(updateData: Partial<PlaylistItemSchema>, playlistId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        await db.update(playlists).set(updateData).where(eq(playlists.id, playlistId))
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to update playlist:", message)
        throw new Error(message)
    }
}
