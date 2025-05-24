"use client"
import React, { CSSProperties, forwardRef, HTMLAttributes, useCallback } from "react"

import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSortable } from "@dnd-kit/sortable"
import { toast } from "sonner"

import { Card } from "@/components/ui/card"
import { VideoListItemDropdown } from "./video-list-item-dropdown"

import { constructYoutubeUrlWithTimestamp, convertDurationToString, formatViews } from "@/lib/utils"
import { useConfirmDialog } from "../providers/confirm-dialog-provider"
import { useDialog } from "../providers/dialog-provider"

import { deletePlaylistItem } from "@/db/playlist/delete-playlist-item"
import { duplicatePlaylistItem } from "@/db/playlist/duplicate-playlist-item"
import { PlaylistItem } from "@/db/playlist/add-video"

import { CirclePause, CirclePlay, GripVertical, Pencil } from "lucide-react"
import { UpdateVideoNameForm } from "./update-video-name-form"
import { Button } from "../ui/button"

import { DraggableAttributes } from "@dnd-kit/core"
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import CustomSlider from "./custom-slider"
import { PLAYER_STATUS } from "./youtube-player"
import { usePlaylistStore } from "@/store/store"

type VideoListItemProps = {
    video: PlaylistItem
    isDragging?: boolean
    attributes?: DraggableAttributes
    listeners?: SyntheticListenerMap | undefined
} & HTMLAttributes<HTMLDivElement>

const BaseVideoListItem = forwardRef<HTMLDivElement, VideoListItemProps>(({ video, isDragging, style, attributes, listeners }, ref) => {
    const styles: CSSProperties = {
        opacity: isDragging ? "0.4" : "1",
        ...style,
    }

    const router = useRouter()
    const confirm = useConfirmDialog()
    const { openDialog, closeDialog } = useDialog()

    const activeVideo = usePlaylistStore((state) => state.activeVideo)
    const setActiveVideo = usePlaylistStore((state) => state.setActiveVideo)
    const player = usePlaylistStore((state) => state.player)
    const playerState = usePlaylistStore((state) => state.playerState)

    const handlePlay = useCallback(async () => {
        if (!player) return

        // Account for the case when same id but different timestamps
        if (video.id === activeVideo?.id && playerState !== PLAYER_STATUS.ended) {
            if (playerState === PLAYER_STATUS.playing) {
                player.pauseVideo()
            } else {
                player.playVideo()
            }
        } else {
            setActiveVideo(video)
            player.loadVideoById({
                videoId: video.videoId,
                startSeconds: video.timestamp[0],
                endSeconds: video.timestamp[1],
            })
        }
    }, [player, video, playerState, activeVideo, setActiveVideo])

    const handleDelete = useCallback(async () => {
        try {
            await confirm({
                dialogProps: {
                    title: "Delete this video",
                    message: "Are you sure you want to delete this video?",
                },
                buttonProps: {
                    label: "Delete",
                    variant: "destructive",
                },
            })
            await deletePlaylistItem(video.id)
            router.refresh()
        } catch (e: unknown) {
            if (e !== "Confirmation Reject") {
                toast.error("Unable to delete video. Please try again.")
            }
        }
    }, [video.id, router, confirm])

    const handleDuplicate = useCallback(async () => {
        try {
            await duplicatePlaylistItem(video, video.playlistId)
            router.refresh()
        } catch (e: unknown) {
            if (e !== "Confirmation Reject") {
                toast.error("Unable to duplicate video. Please try again.")
            }
        }
    }, [video, router])

    const handleEditName = useCallback(async () => {
        try {
            openDialog({
                title: "Edit video name",
                content: (
                    <UpdateVideoNameForm
                        videoId={video.id}
                        name={video.itemName}
                        onSuccess={closeDialog}
                    />
                ),
            })
        } catch (e: unknown) {
            if (e !== "Confirmation Reject") {
                toast.error("Unable to duplicate video. Please try again.")
            }
        }
    }, [openDialog, closeDialog, video])

    const showCustomName = video.itemName !== video.title
    const isCurrentVideoActive = activeVideo?.id === video.id

    return (
        <Card
            className={`transition-[box-shadow] duration-300 flex flex-row items-center gap-4 p-2 overflow-hidden group ${isCurrentVideoActive ? "ring-2 ring-green-400/65 " : ""}`}
            style={styles}
            ref={ref}
        >
            <Button
                variant="ghost"
                className="flex-shrink-0 rounded-md relative w-40 h-[90px]"
                onClick={handlePlay}
            >
                {/* Thumbnail with play button overlay */}
                <Image
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100">
                    {isCurrentVideoActive && playerState === PLAYER_STATUS.playing ? (
                        <CirclePause
                            strokeWidth={1}
                            className="size-10 text-white/85"
                        />
                    ) : (
                        <CirclePlay
                            strokeWidth={1}
                            className="size-10 text-white/85"
                        />
                    )}
                </div>
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{convertDurationToString(video.duration)}</div>
            </Button>

            <div className="flex-1 min-w-0 py-2">
                <div className="flex justify-between items-start">
                    <div className="pr-6">
                        <div className="flex gap-4 items-baseline">
                            <h4 className="font-medium line-clamp-2 text-sm">{video.itemName}</h4>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-3.5 opacity-0 group-hover:opacity-100"
                                onClick={handleEditName}
                            >
                                <Pencil className="size-3.5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {showCustomName && <span className="font-medium text-xs text-muted-foreground mt-1">{video.title} • </span>}
                            {video.channel} • {formatViews(video.views)}
                        </p>
                    </div>

                    <div className="flex gap-2 items-center">
                        <VideoListItemDropdown
                            url={constructYoutubeUrlWithTimestamp(video)}
                            handleDuplicate={handleDuplicate}
                            handleDelete={handleDelete}
                        />
                        <div
                            className="opacity-1000 group-hover:opacity-100 cursor-move"
                            {...listeners}
                            {...attributes}
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <CustomSlider video={video} />
                </div>
            </div>
        </Card>
    )
})

BaseVideoListItem.displayName = "VideoListItem"

export const VideoListItem = React.memo(BaseVideoListItem)

type SortableVideoListItem = {
    video: PlaylistItem
} & HTMLAttributes<HTMLDivElement>

export const SortableVideoItem = ({ video, ...props }: SortableVideoListItem) => {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: video.id,
    })

    const styles: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        touchAction: "none",
    }

    return (
        <VideoListItem
            video={video}
            ref={setNodeRef}
            style={styles}
            isDragging={isDragging}
            attributes={attributes}
            listeners={listeners}
            {...props}
        />
    )
}
