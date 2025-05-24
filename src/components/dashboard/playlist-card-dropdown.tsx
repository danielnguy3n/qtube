"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { UpdatePlaylistNameForm } from "../playlist-page/update-playlist-name-form"

import { deletePlaylist } from "@/db/playlists/deletePlaylist"

import { useDialog } from "../providers/dialog-provider"
import { useConfirmDialog } from "../providers/confirm-dialog-provider"

import { PlaylistSchema } from "./playlist-card"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"

export default function PlaylistCardDropdown({ playlist }: { playlist: PlaylistSchema }) {
    const router = useRouter()
    const confirm = useConfirmDialog()
    const { openDialog, closeDialog } = useDialog()

    const handleEditName = async () => {
        try {
            openDialog({
                title: "Edit playlist name",
                content: (
                    <UpdatePlaylistNameForm
                        playlistId={playlist.id}
                        name={playlist.name}
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
            await deletePlaylist(playlist.id)
            router.refresh()
        } catch (e: unknown) {
            if (e !== "Confirmation Reject") {
                toast.error("Unable to delete playlist. Please try again.")
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 absolute right-2"
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(event) => event.stopPropagation()}
                    onSelect={handleEditName}
                >
                    <Pencil /> Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive z-50"
                    onClick={(event) => event.stopPropagation()}
                    onSelect={handleDelete}
                >
                    <Trash2 className="text-inherit" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
