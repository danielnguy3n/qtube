import { PlaylistItem } from "@/db/playlist/add-video"
import { YouTubePlayer } from "react-youtube"
import PlayerStates from "youtube-player/dist/constants/PlayerStates"
import { create } from "zustand"

interface PlaylistState {
    playlist: PlaylistItem[]
    setPlaylist: (playlist: PlaylistItem[]) => void
    activeVideo: PlaylistItem | null
    setActiveVideo: (activeVideo: PlaylistItem) => void
    player: YouTubePlayer | null
    setPlayer: (player: YouTubePlayer) => void
    playerState: PlayerStates
    setPlayerState: (playerState: PlayerStates) => void
}

export const usePlaylistStore = create<PlaylistState>()((set) => ({
    playlist: [],
    setPlaylist: (playlist) => set(() => ({ playlist: playlist })),
    activeVideo: null,
    setActiveVideo: (activeVideo) => set(() => ({ activeVideo: activeVideo })),
    player: null,
    setPlayer: (player) => set(() => ({ player: player })),
    playerState: 0,
    setPlayerState: (playerState) => set(() => ({ playerState: playerState })),
}))
