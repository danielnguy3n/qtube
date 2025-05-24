"use client"

import { usePlaylistStore } from "@/store/store"
import React, { useRef } from "react"
import YouTube, { YouTubeProps } from "react-youtube"

export const PLAYER_STATUS = {
    unstarted: -1,
    ended: 0,
    playing: 1,
    paused: 2,
    buffering: 3,
    videoCued: 5,
}

const YoutubePlayer = () => {
    const setPlayer = usePlaylistStore((state) => state.setPlayer)
    const activeVideo = usePlaylistStore((state) => state.activeVideo)
    const setActiveVideo = usePlaylistStore((state) => state.setActiveVideo)
    const videos = usePlaylistStore((state) => state.playlist)
    const setPlayerState = usePlaylistStore((state) => state.setPlayerState)

    const playlist = videos.map((video) => ({
        videoId: video.videoId,
        startSeconds: video.timestamp[0],
        endSeconds: video.timestamp[1],
    }))

    // https://developers.google.com/youtube/iframe_api_reference#Queueing_Functions
    // player.cueVideoById === event.target.cueVideoById
    // If you specify an endSeconds value and then call seekTo(), the endSeconds value will no longer be in effect.
    // player.getCurrentTime() > endSeconds

    const onPlayerReady: YouTubeProps["onReady"] = async (event) => {
        setPlayer(event.target)
        if (activeVideo) {
            await event.target.cueVideoById({
                videoId: activeVideo.videoId,
                startSeconds: activeVideo.timestamp[0],
                endSeconds: activeVideo.timestamp[1],
            })
        }
    }

    const hasHandledEndRef = useRef(false)

    const onPlayerStateChange: YouTubeProps["onStateChange"] = async (event) => {
        const playerState = await event.target.getPlayerState()
        setPlayerState(playerState)

        if (playerState === PLAYER_STATUS.ended) {
            // Flag to circumvent double state change when player ends
            if (hasHandledEndRef.current) return
            hasHandledEndRef.current = true

            const activeIndex = videos.findIndex((item) => item.position === activeVideo?.position)
            const nextVideo = videos.find((_, i) => i === activeIndex + 1)

            if (nextVideo) {
                event.target.loadVideoById({
                    videoId: nextVideo.videoId,
                    startSeconds: nextVideo.timestamp[0],
                    endSeconds: nextVideo.timestamp[1],
                })
                setActiveVideo(nextVideo)
            }
        }

        if (playerState === PLAYER_STATUS.playing) {
            // reset end flag when new video starts playing
            hasHandledEndRef.current = false
        }
    }

    const opts: YouTubeProps["opts"] = {
        height: "100%",
        width: "100%",
        playerVars: {
            controls: 1,
            autoplay: 0,
        },
    }

    if (playlist.length === 0) return null

    return (
        <YouTube
            className="w-full h-full"
            // videoId={activeVideo?.videoId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
        />
    )
}

export default YoutubePlayer
