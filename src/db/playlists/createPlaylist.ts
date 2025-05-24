"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { playlists } from "@/db/schema"

export async function createPlaylist(name: string) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        const playlist = await db
            .insert(playlists)
            .values({
                name: name,
                description: "",
                userId: session.user.id,
            })
            .returning({ id: playlists.id })

        return playlist[0].id
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to create playlist:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}
