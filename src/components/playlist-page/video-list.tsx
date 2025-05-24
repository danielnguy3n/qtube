"use client"

import React, { useEffect, useId, useRef, useState } from "react"

import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { toast } from "sonner"

import { PlaylistItem } from "@/db/playlist/add-video"
import { updatePlaylistPositions } from "@/db/playlist/update-playlist-item"
// import { useVideoPlayer } from "../providers/video-player-provider"
import { useRouter } from "next/navigation"
import { SortableVideoItem, VideoListItem } from "./video-list-item"
import { usePlaylistStore } from "@/store/store"

export default function VideoList({ videos }: { videos: PlaylistItem[] }) {
    const [items, setItems] = useState<PlaylistItem[]>(videos)
    const [activeItem, setActiveItem] = useState<PlaylistItem>()

    useEffect(() => {
        setItems(videos)
    }, [videos])

    const activeVideo = usePlaylistStore((state) => state.activeVideo)
    const setActiveVideo = usePlaylistStore((state) => state.setActiveVideo)
    const setPlaylist = usePlaylistStore((state) => state.setPlaylist)

    const id = useId()
    const router = useRouter()

    const hasMounted = useRef(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0.1,
            },
        }),
        useSensor(TouchSensor)
    )

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveItem(items.find((item) => item.id === active.id))
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeItem = items.find((item) => item.id === active.id)
        const overItem = items.find((item) => item.id === over.id)

        if (!activeItem || !overItem) {
            return
        }

        const activeIndex = items.findIndex((item) => item.id === active.id)
        const overIndex = items.findIndex((item) => item.id === over.id)

        if (activeIndex !== overIndex) {
            const moved = arrayMove<PlaylistItem>(items, activeIndex, overIndex)
            const updatedItems = moved.map((item, i) => ({ ...item, position: i }))
            setItems(updatedItems)
            setPlaylist(updatedItems)

            if (activeVideo) {
                const updatedActiveVideoIndex = moved.findIndex((item) => item.id === activeVideo?.id)!
                setActiveVideo({ ...activeVideo, position: updatedActiveVideoIndex })
            }
        }

        setActiveItem(undefined)
    }

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            return
        }

        async function updatePositions() {
            try {
                await updatePlaylistPositions(
                    items.map((item, index) => ({ id: item.id, position: index })),
                    items[0].playlistId
                )
                // router.refresh()
            } catch {
                toast.error("Unable to update position")
            }
        }
        updatePositions()
    }, [items, router])

    const handleDragCancel = () => {
        setActiveItem(undefined)
    }

    return (
        <DndContext
            id={id}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {items.map((video) => (
                        <SortableVideoItem
                            key={video.id}
                            video={video}
                        />
                    ))}
                </div>
            </SortableContext>
            <DragOverlay>{activeItem ? <VideoListItem video={activeItem} /> : null}</DragOverlay>
        </DndContext>
    )
}
