import Link from "next/link"
import { ChevronLeft, FolderX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PlaylistNotFound() {
    return (
        <div className="bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="bg-muted/20 p-6 rounded-full mb-6">
                        <FolderX className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold mb-3">Playlist Not Found</h1>
                    <p className="text-muted-foreground max-w-md mb-8">The playlist you&apos;re looking for doesn&apos;t exist or may have been deleted.</p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Button
                            asChild
                            className="gap-2"
                        >
                            <Link href="/dashboard">
                                <ChevronLeft className="h-4 w-4" />
                                View all playlists
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
