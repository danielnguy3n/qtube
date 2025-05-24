"use client"

import React from "react"

import { toast } from "sonner"
import { Button } from "../ui/button"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { deletePlaylist } from "@/db/playlists/deletePlaylist"
import { useConfirmDialog } from "../providers/confirm-dialog-provider"

import { ChevronLeft, Pencil, Trash2 } from "lucide-react"
import { UpdatePlaylistNameForm } from "./update-playlist-name-form"
import { useDialog } from "../providers/dialog-provider"

export default function PlaylistHeader({ playlistId, name }: { playlistId: number; name: string }) {
    const router = useRouter()
    const confirm = useConfirmDialog()
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

    const handleDelete = async () => {
        try {
            await confirm({
                dialogProps: {
                    title: "Delete this playlist",
                    message: "Are you sure you want to delete this playlist?",
                },
                buttonProps: {
                    label: "Delete",
                    variant: "destructive",
                },
            })
            await deletePlaylist(playlistId)
            router.replace("/dashboard")
        } catch (e: unknown) {
            console.log({ e })
            if (e !== "Confirmation Reject") {
                toast.error("Unable to delete playlist. Please try again.")
            }
        }
    }

    return (
        <div className="flex items-center justify-between gap-2 mb-4 group">
            <div className="flex items-center gap-2">
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
            <Button
                variant="ghost"
                size="icon"
                className="size-4 opacity-0 group-hover:opacity-100"
                onClick={handleDelete}
            >
                <Trash2 className="h-5 w-5 text-inherit " />
            </Button>
        </div>
    )
}
