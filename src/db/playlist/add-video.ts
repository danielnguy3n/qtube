"use server"

import { auth } from "@/auth"
import { db } from "@/db"

import { VideoProps } from "@/components/playlist-page/video-preview"
import { playlistItems } from "@/db/schema"
import { fetchPlaylistLength } from "./fetch-playlist"

export type PlaylistItem = {
    id: number
    timestamp: Array<number>
    itemName: string
    position: number
    playlistId: number
} & VideoProps

type BodyProps = Omit<PlaylistItem, "id" | "playlistId" | "position">

export async function addPlaylistItem(body: BodyProps, playlistId: number) {
    try {
        const session = await auth()

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        const playlistLength = await fetchPlaylistLength(playlistId)

        const response = await db
            .insert(playlistItems)
            .values({
                ...body,
                playlistId,
                position: playlistLength + 1,
            })
            .returning({
                id: playlistItems.id,
            })

        return response[0].id
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred"
        console.error("Failed to add playlist item:", message)
        throw new Error(message) // re-throw to let caller handle it
    }
}
