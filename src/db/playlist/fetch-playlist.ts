"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlistItems } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function fetchPlaylistLength(playlistId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        const response = await db.$count(playlistItems, eq(playlistItems.playlistId, playlistId))

        return response
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to fetch playlist length:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}

export async function fetchPlaylist(playlistId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        const response = await db.query.playlists.findFirst({
            where: (playlists, { eq }) => and(eq(playlists.id, playlistId), eq(playlists.userId, session.user.id)),
            with: {
                items: {
                    orderBy: (items, { asc }) => [asc(items.position)],
                },
            },
        })

        return response
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to fetch playlist:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}
