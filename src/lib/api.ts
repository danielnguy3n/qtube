"use client"

import { auth } from "@/auth"
import { Session } from "next-auth"

async function fetchYoutubeVideo(id: string) {
    try {
        const session = (await auth()) as Session

        console.log({ id, session })

        if (!session) {
            throw new Error("Please sign in with Google")
        }

        const data = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
        })
        const response = await data.json()
        return response.items[0] || {}
    } catch (error) {
        console.error("Error", error)
    }
}

export { fetchYoutubeVideo }

// Create playlist
// Add song to playlist by linking youtube video
// Hit youtube api endpoint to fetch youtube meta data from link
// Save youtube video data + own data (timestamps, names, position) into database
// When user refreshes page
// We just fetch from database and not the youtube api
// Set up
