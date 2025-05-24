"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlistItems } from "@/db/schema"
import { eq, InferSelectModel } from "drizzle-orm"

export type PlaylistItemSchema = InferSelectModel<typeof playlistItems>

export async function deletePlaylistItem(id: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        await db.delete(playlistItems).where(eq(playlistItems.id, id))
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to update positions:", message)
        throw new Error(message)
    }
}
