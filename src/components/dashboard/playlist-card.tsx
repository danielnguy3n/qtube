import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { timeAgo } from "@/lib/utils"
import { InferSelectModel } from "drizzle-orm"
import { playlists } from "@/db/schema"
import { PlaylistItem } from "@/db/playlist/add-video"
import PlaylistCardDropdown from "./playlist-card-dropdown"

export type PlaylistSchema = InferSelectModel<typeof playlists> & {
    items: PlaylistItem[]
}

export default async function PlaylistCard({ playlist }: { playlist: PlaylistSchema }) {
    return (
        <Link
            href={`/playlist/${playlist.id}`}
            key={playlist.id}
            className="group"
        >
            <Card className="overflow-hidden transition-all hover:shadow-md hover:bg-accent">
                <div className="aspect-video relative overflow-hidden">
                    <Image
                        src={playlist.items[0]?.thumbnailUrl || "https://kzmp1bbekime43eeproi.lite.vusercontent.net/placeholder.svg?height=720&width=1280"}
                        alt={playlist.name}
                        fill
                        className="object-cover transition-all group-hover:bg-black/20"
                    />
                </div>
                <CardContent className="flex py-4 justify-between relative">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {playlist.items.length} videos • Updated {timeAgo(playlist.updatedAt)}
                        </p>
                    </div>
                    <div>
                        <PlaylistCardDropdown playlist={playlist} />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
