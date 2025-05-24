"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlistItems } from "@/db/schema"
import { eq, InferSelectModel, sql } from "drizzle-orm"

export type PlaylistItemSchema = InferSelectModel<typeof playlistItems>

export async function updatePlaylistItem(updateData: Partial<PlaylistItemSchema>, playlistItemId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        await db.update(playlistItems).set(updateData).where(eq(playlistItems.id, playlistItemId))
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to update item:", message)
        throw new Error(message)
    }
}

export async function updatePlaylistPositions(items: Array<{ id: number; position: number }>, id: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        const values = items.map((item) => sql`(${item.id}::int, ${item.position}::int)`)

        await db.execute(
            sql`
          UPDATE ${playlistItems} AS p
          SET position = v.new_position
          FROM (
            VALUES ${sql.join(values, sql`, `)}
          ) AS v(id, new_position)
          WHERE v.id = p.id AND p.playlist_id = ${sql.raw(id.toString())}
        `
        )
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to update positions:", message)
        throw new Error(message)
    }
}
