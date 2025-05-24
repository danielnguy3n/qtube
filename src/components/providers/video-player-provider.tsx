"use client"
import { PlaylistItem } from "@/db/playlist/add-video"
import React, { createContext, useContext, useEffect } from "react"
import { PLAYER_STATUS } from "../playlist-page/youtube-player"
import { usePlaylistStore } from "@/store/store"

const SEEK_TIME = 5

interface VideoPlayerContextProps {
    // activeIndex: number
    // setActiveIndex: Dispatch<SetStateAction<number>>
    // player: YouTubePlayer | undefined
    // setPlayer: Dispatch<SetStateAction<YouTubePlayer | undefined>>
    // playerState: PlayerStates
    // setPlayerState: Dispatch<SetStateAction<PlayerStates>>
    // activeVideo: PlaylistItem
    // setActiveVideo: Dispatch<SetStateAction<PlaylistItem>>
    playlist: PlaylistItem[]
}
const VideoPlayerContext = createContext<VideoPlayerContextProps | null>(null)

const VideoPlayerProvider: React.FC<{ children: React.ReactNode; playlist: PlaylistItem[] }> = ({ children, playlist }) => {
    // put this playlist into store and perform all functions to set up store in this context
    // doing this to ultimately make it easier to set Active video so that it can be accessed in both player and playlist
    // const [activeIndex, setActiveIndex] = useState(0)
    // const [player, setPlayer] = useState<YouTubePlayer>()
    // const [playerState, setPlayerState] = useState<PlayerStates>(0)
    // const [activeVideo, setActiveVideo] = useState<PlaylistItem>(playlist.find((video) => video.position === 0)!)

    const setPlaylist = usePlaylistStore((state) => state.setPlaylist)
    const setActiveVideo = usePlaylistStore((state) => state.setActiveVideo)
    const player = usePlaylistStore((state) => state.player)
    const playerState = usePlaylistStore((state) => state.playerState)

    useEffect(() => {
        setPlaylist(playlist)
        setActiveVideo(playlist[0])
    }, [setPlaylist, setActiveVideo, playlist])

    const contextProps = {
        playlist,
    }

    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            const target = e.target as HTMLElement

            // Ignore if typing in input, textarea, or contenteditable
            const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable

            if (isTyping || !player) return

            if (e.code === "Space") {
                e.preventDefault()
                if (playerState === PLAYER_STATUS.playing) {
                    player.pauseVideo()
                } else {
                    player.playVideo()
                }
            }

            if (e.code === "ArrowRight") {
                const currentTime = await player.getCurrentTime()
                e.preventDefault()
                player.seekTo(currentTime + SEEK_TIME, true)
            }

            if (e.code === "ArrowLeft") {
                const currentTime = await player.getCurrentTime()
                e.preventDefault()
                player.seekTo(currentTime - SEEK_TIME, true)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [player, playerState])

    return <VideoPlayerContext.Provider value={contextProps}>{children}</VideoPlayerContext.Provider>
}

const useVideoPlayer = () => {
    const videoPlayerContext = useContext(VideoPlayerContext)

    if (!videoPlayerContext) {
        throw new Error("useVideoPlayer must be used within VideoPlayerContext")
    }

    return videoPlayerContext
}

export { VideoPlayerProvider, useVideoPlayer }
