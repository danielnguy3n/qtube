"use client"

import React from "react"

import { toast } from "sonner"
import { Button } from "../ui/button"
import Link from "next/link"

import { ChevronLeft, Pencil } from "lucide-react"
import { UpdatePlaylistNameForm } from "./update-playlist-name-form"
import { useDialog } from "../providers/dialog-provider"

export default function PlaylistHeader({ playlistId, name }: { playlistId: number; name: string }) {
    const { openDialog, closeDialog } = useDialog()

    const handleEditName = async () => {
        try {
            openDialog({
                title: "Edit playlist name",
                content: (
                    <UpdatePlaylistNameForm
                        playlistId={playlistId}
                        name={name}
                        onSuccess={closeDialog}
                    />
                ),
            })
        } catch (e: unknown) {
            if (e !== "Confirmation Reject") {
                toast.error("Unable to update playlist. Please try again.")
            }
        }
    }

    return (
        <div className="flex items-center gap-2 mb-4 group">
            <Button
                variant="ghost"
                size="icon"
                asChild
            >
                <Link href="/dashboard">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            </Button>
            <div className="flex gap-4 items-center">
                <h1 className="text-2xl font-bold">{name}</h1>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-4 opacity-0 group-hover:opacity-100"
                    onClick={handleEditName}
                >
                    <Pencil className="size-4" />
                </Button>
            </div>
        </div>
    )
}
