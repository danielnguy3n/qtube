import { PlaylistItem } from "@/db/playlist/add-video"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatISODuration(isoDuration: string): string {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    const matches = isoDuration.match(regex)

    if (!matches) return "00:00"

    const hours = parseInt(matches[1] || "0", 10)
    const minutes = parseInt(matches[2] || "0", 10)
    const seconds = parseInt(matches[3] || "0", 10)

    const paddedMinutes = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes)
    const paddedSeconds = String(seconds).padStart(2, "0")

    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`
    } else {
        return `${paddedMinutes}:${paddedSeconds}`
    }
}

export function convertYoutubeDurationToSeconds(youtubeDuration: string): number {
    const regex = /P(?:\d+Y)?(?:\d+M)?(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    const matches = youtubeDuration.match(regex)

    if (!matches) {
        return 0
    }

    const hours = parseInt(matches[1] || "0", 10)
    const minutes = parseInt(matches[2] || "0", 10)
    const seconds = parseInt(matches[3] || "0", 10)

    return hours * 3600 + minutes * 60 + seconds
}

export function formatViews(viewsString: string) {
    const views = parseInt(viewsString, 10)
    if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M views`
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K views`
    }
    return `${views} views`
}

export function timeAgo(dateString: string | Date) {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000)

    const intervals = [
        { label: "year", seconds: 31_536_000 },
        { label: "month", seconds: 2_592_000 },
        { label: "week", seconds: 604_800 },
        { label: "day", seconds: 86_400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ]

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds)
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
        }
    }

    return "just now"
}

export const convertDurationToString = (duration: number) => {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    } else {
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
}

export function durationStringToSeconds(duration: string): number {
    const parts = duration.split(":").map(Number)

    if (parts.length === 3) {
        // HH:MM:SS
        const [hours, minutes, seconds] = parts
        return hours * 3600 + minutes * 60 + seconds
    } else if (parts.length === 2) {
        // MM:SS
        const [minutes, seconds] = parts
        return minutes * 60 + seconds
    } else if (parts.length === 1) {
        // Just seconds
        return parts[0]
    }

    return 0
}

export const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
    let timeoutTimer: ReturnType<typeof setTimeout>

    return (...args: T) => {
        clearTimeout(timeoutTimer)

        timeoutTimer = setTimeout(() => {
            callback(...args)
        }, delay)
    }
}

export const formatInputIntoString = (input: string) => {
    const raw = input.replace(/[^\d]/g, "")

    if (raw.length <= 2) {
        return `0:0:${raw.padStart(2, "0")}`
    } else if (raw.length <= 4) {
        const minutes = raw.slice(0, raw.length - 2)
        const seconds = raw.slice(-2)
        return `0:${minutes}:${seconds}`
    } else {
        const hours = raw.slice(0, raw.length - 4)
        const minutes = raw.slice(-4, -2)
        const seconds = raw.slice(-2)
        return `${hours}:${minutes}:${seconds}`
    }
}

export function extractYouTubeVideoId(url: string): string | null {
    try {
        const parsedUrl = new URL(url)
        const hostname = parsedUrl.hostname

        if (hostname === "www.youtube.com" || hostname === "youtube.com" || hostname === "m.youtube.com") {
            if (parsedUrl.pathname === "/watch") {
                return parsedUrl.searchParams.get("v")
            } else if (parsedUrl.pathname.startsWith("/embed/")) {
                return parsedUrl.pathname.split("/embed/")[1]
            }
        }

        if (hostname === "youtu.be") {
            return parsedUrl.pathname.slice(1)
        }
    } catch {
        return null
    }

    return null
}

export function constructYoutubeUrlWithTimestamp(video: PlaylistItem) {
    const [startTimestamp] = video.timestamp
    return startTimestamp && startTimestamp > 0 ? `${video.url}&t=${startTimestamp}s` : video.url
}

export function findAdjacentElementsInArray<T>(array: T[], predicate: (item: T) => boolean): { prev?: T; next?: T } {
    const index = array.findIndex(predicate)
    return {
        prev: index > 0 ? array[index - 1] : undefined,
        next: index >= 0 && index < array.length - 1 ? array[index + 1] : undefined,
    }
}
