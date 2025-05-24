"use client"

import { memo } from "react"
import Link from "next/link"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { Copy, ExternalLink, MoreVertical, Trash2 } from "lucide-react"

interface VideoListItemDropdownProps {
    url: string
    handleDelete: () => void
    handleDuplicate: () => void
}

function BaseVideoListItemDropdown({ url, handleDelete, handleDuplicate }: VideoListItemDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <ExternalLink />
                    <Link
                        href={url}
                        target="_blank"
                    >
                        Open in new tab
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDuplicate}>
                    <Copy /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive z-50"
                    onSelect={handleDelete}
                >
                    <Trash2 className="text-inherit" />
                    Remove from playlist
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const VideoListItemDropdown = memo(BaseVideoListItemDropdown)
