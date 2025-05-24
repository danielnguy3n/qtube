"use client"

import React, { useCallback } from "react"

import { constructYoutubeUrlWithTimestamp, findAdjacentElementsInArray, formatViews } from "@/lib/utils"
import { Button } from "../ui/button"
import { ExternalLink, Pause, Play, SkipBack, SkipForward } from "lucide-react"
import Link from "next/link"
import { PLAYER_STATUS } from "./youtube-player"
import { usePlaylistStore } from "@/store/store"

export default function CurrentVideoHeader() {
    const activeVideo = usePlaylistStore((state) => state.activeVideo)
    const playlist = usePlaylistStore((state) => state.playlist)
    const player = usePlaylistStore((state) => state.player)
    const playerState = usePlaylistStore((state) => state.playerState)
    const setActiveVideo = usePlaylistStore((state) => state.setActiveVideo)

    const { prev, next } = findAdjacentElementsInArray(playlist, (item) => item.id === activeVideo?.id)

    const handlePlay = useCallback(async () => {
        if (!player) return
        if (playerState === PLAYER_STATUS.playing) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
    }, [player, playerState])

    const handlePrevious = useCallback(async () => {
        if (!prev || !player) return
        setActiveVideo(prev)
        player.loadVideoById({
            videoId: prev.videoId,
            startSeconds: prev.timestamp[0],
            endSeconds: prev.timestamp[1],
        })
    }, [player, prev, setActiveVideo])

    const handleNext = useCallback(async () => {
        if (!next || !player) return
        setActiveVideo(next)
        player.loadVideoById({
            videoId: next.videoId,
            startSeconds: next.timestamp[0],
            endSeconds: next.timestamp[1],
        })
    }, [player, next, setActiveVideo])

    if (!activeVideo) return null
    const showCustomName = activeVideo.itemName !== activeVideo.title

    return (
        <div className="flex justify-between items-center gap-4 my-8">
            <div className="">
                <div className="flex items-center gap-2 group">
                    <h2 className="transition-all text-xl font-semibold line-clamp-2">{activeVideo.itemName}</h2>
                    <Button
                        asChild
                        className="opacity-0 group-hover:opacity-100"
                        variant="ghost"
                        size="icon"
                    >
                        <Link
                            href={constructYoutubeUrlWithTimestamp(activeVideo)}
                            target="_blank"
                        >
                            <ExternalLink
                                className="size-4"
                                fill="black"
                            />
                        </Link>
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                    {showCustomName && <span>{activeVideo.title} • </span>}
                    {activeVideo.channel} • {formatViews(activeVideo.views)}
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <Button
                    className="rounded-full size-8"
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                >
                    <SkipBack
                        className="size-4"
                        fill="black"
                    />
                </Button>
                <Button
                    className="rounded-full size-12"
                    size="icon"
                    onClick={handlePlay}
                >
                    {playerState === PLAYER_STATUS.playing ? (
                        <Pause
                            fill="black"
                            className="size-6"
                        />
                    ) : (
                        <Play
                            fill="black"
                            className="size-6"
                        />
                    )}
                </Button>
                <Button
                    className="rounded-full size-8"
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                >
                    <SkipForward
                        className="size-4"
                        fill="black"
                    />
                </Button>
            </div>
        </div>
    )
}
