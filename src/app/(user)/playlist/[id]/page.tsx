import { AddVideoButton } from "@/components/playlist-page/add-video-button"
import VideoList from "@/components/playlist-page/video-list"
import PlaylistHeader from "@/components/playlist-page/playlist-header"
import YoutubePlayer from "@/components/playlist-page/youtube-player"

import { fetchPlaylist } from "@/db/playlist/fetch-playlist"

import { VideoPlayerProvider } from "@/components/providers/video-player-provider"
import CurrentVideoHeader from "@/components/playlist-page/current-video-header"
import { Card } from "@/components/ui/card"
import { Video } from "lucide-react"
import PlaylistNotFound from "./not-found"

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params
    const playlist = await fetchPlaylist(id)

    if (!playlist) {
        return <PlaylistNotFound />
    }

    const isPlaylistEmpty = !playlist.items.length

    return (
        <VideoPlayerProvider playlist={playlist.items}>
            <div>
                <PlaylistHeader
                    playlistId={id}
                    name={playlist.name}
                />

                {isPlaylistEmpty ? (
                    <Card className="w-full flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-muted/30 p-6 rounded-full mb-6">
                            <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">This playlist is empty</h2>
                        <p className="text-muted-foreground max-w-md mb-8">Add videos to this playlist to start watching and organizing your content.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <AddVideoButton />
                        </div>

                        {/* Empty state illustration */}
                        <div className="mt-12 border-t border-border pt-8 w-full max-w-md">
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-40 h-[90px] bg-muted/30 rounded-md"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-muted/30 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-muted/30 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="aspect-video relative">
                            <YoutubePlayer />
                        </div>

                        <CurrentVideoHeader />

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Videos in this playlist</h3>
                                <AddVideoButton />
                            </div>
                            <VideoList videos={playlist.items} />
                        </div>
                    </>
                )}
            </div>
        </VideoPlayerProvider>
    )
}
