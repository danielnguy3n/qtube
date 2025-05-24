import { CreatePlaylistButton } from "@/components/dashboard/create-playlist-button"
import { Music } from "lucide-react"
import { fetchPlaylists } from "@/db/playlists/fetchPlaylists"
import PlaylistCard from "@/components/dashboard/playlist-card"

export default async function PlaylistDashboard() {
    const playlists = await fetchPlaylists()

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
                <CreatePlaylistButton />
            </div>

            {!playlists.length ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="bg-muted/30 p-6 rounded-full mb-6">
                        <Music className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No playlists yet</h2>
                    <p className="text-muted-foreground max-w-md mb-8">Create your first playlist to start organizing your favorite videos in collections.</p>
                    <CreatePlaylistButton />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {playlists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.id}
                            playlist={playlist}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
