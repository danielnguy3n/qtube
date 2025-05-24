"use server"

import { auth } from "@/auth"
import { db } from "@/db"

import { playlistItems } from "@/db/schema"
import { PlaylistItem } from "./add-video"
import { and, eq, gt, sql } from "drizzle-orm"

type BodyProps = Omit<PlaylistItem, "playlistId">

export async function duplicatePlaylistItem(body: BodyProps, playlistId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...video } = body

        await db
            .update(playlistItems)
            .set({ position: sql`${playlistItems.position} + 1` })
            .where(and(eq(playlistItems.playlistId, playlistId), gt(playlistItems.position, body.position)))

        const response = await db
            .insert(playlistItems)
            .values({
                ...video,
                playlistId,
                position: body.position + 1,
            })
            .returning({
                id: playlistItems.id,
            })

        return response[0].id
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to duplicate playlist item:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}
