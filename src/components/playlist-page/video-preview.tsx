"use client"

import Image from "next/image"
import Link from "next/link"

import { Skeleton } from "../ui/skeleton"

import { convertDurationToString, formatViews, timeAgo } from "@/lib/utils"

export interface VideoProps {
    videoId: string
    url: string
    thumbnailUrl: string
    duration: number
    channel: string
    views: string
    title: string
    publishedAt: string
}

export const VideoPreviewSkeleton = () => {
    return (
        <div className="flex items-center border border-gray-700 rounded-sm p-4 gap-4">
            <Skeleton className="h-[90px] w-[120px]" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export const VideoPreviewBase: React.FC<VideoProps> = ({ url, thumbnailUrl, duration, title, channel, views, publishedAt }) => {
    return (
        <Link
            href={url}
            target="_blank"
            className="flex items-center border border-gray-700 rounded-sm p-4 gap-4 hover:border-gray-300 transition-[border]"
        >
            <div className="relative w-[120px]">
                <Image
                    src={thumbnailUrl}
                    alt="thumb"
                    width={120}
                    height={90}
                />
                <div className="absolute bottom-0 right-0 bg-black/50 rounded-sm p-1 text-xs font-bold">{convertDurationToString(duration)}</div>
            </div>
            <div>
                <div className="overflow-hidden overflow-ellipsi font-bold">{title}</div>
                <div className="text-gray-400">{channel}</div>
                <div className="text-gray-400">
                    <span>{formatViews(views)}</span>
                    <span> · </span>
                    <span>{timeAgo(publishedAt)}</span>
                </div>
            </div>
        </Link>
    )
}
