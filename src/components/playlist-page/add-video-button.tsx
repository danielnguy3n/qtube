"use client"

import React, { useEffect, useState } from "react"

import { z } from "zod"
import { Plus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormState } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "../ui/checkbox"

import { ErrorAlert } from "../Alerts"

import useYoutubeVideo from "@/hooks/useYoutubeVideo"
import SliderWithInputs from "../shared/slider-with-inputs"
import { VideoPreviewBase, VideoPreviewSkeleton } from "./video-preview"

import { addPlaylistItem } from "@/db/playlist/add-video"

import { convertYoutubeDurationToSeconds } from "@/lib/utils"
import { YoutubeVideo } from "@/types/youtube"

const youtubeUrlFormSchema = z.object({
    url: z
        .string()
        .url()
        .refine(
            (url) => {
                try {
                    const parsedUrl = new URL(url)
                    const isYoutubeDomain = parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com"
                    const isWatchPath = parsedUrl.pathname === "/watch"
                    const videoId = parsedUrl.searchParams.get("v")
                    const isValidVideoId = videoId?.length === 11

                    return isYoutubeDomain && isWatchPath && !!isValidVideoId
                } catch {
                    return false
                }
            },
            {
                message: "Must be a valid YouTube watch URL",
            }
        ),
    timestamp: z.number().array(),
})

function extractVideoId(url: string): string | null {
    const regex = /v=([^&]+)/
    const match = url.match(regex)
    return match ? match[1] : null
}

function normaliseMetaData(data: YoutubeVideo | null) {
    if (!data) return null

    return {
        videoId: data.id,
        url: `https://www.youtube.com/watch?v=${data.id}`,
        thumbnailUrl: data.snippet.thumbnails.standard.url,
        duration: convertYoutubeDurationToSeconds(data.contentDetails.duration),
        channel: data.snippet.channelTitle,
        views: data.statistics.viewCount,
        title: data.snippet.title,
        publishedAt: data.snippet.publishedAt,
    }
}

export const AddVideoInputForm = () => {
    const [open, setOpen] = useState(false)
    const [closeWhenDone, setCloseWhenDone] = useState(false)

    const { id: playlistId } = useParams()
    const router = useRouter()

    const form = useForm<z.infer<typeof youtubeUrlFormSchema>>({
        resolver: zodResolver(youtubeUrlFormSchema),
        defaultValues: {
            url: "",
            timestamp: [0, 0],
        },
    })

    const url = form.watch("url")
    const videoId = extractVideoId(url)

    const { data: youtubeMetaData, loading, error } = useYoutubeVideo(videoId)
    const { isValid } = useFormState({ control: form.control })

    const videoPreviewProps = normaliseMetaData(youtubeMetaData)
    const videoDurationInSeconds = videoPreviewProps?.duration

    async function onSubmit(data: z.infer<typeof youtubeUrlFormSchema>) {
        if (!videoPreviewProps) return null

        const body = {
            ...videoPreviewProps,
            itemName: videoPreviewProps ? videoPreviewProps.title : "",
            timestamp: data.timestamp,
        }
        try {
            await addPlaylistItem(body, Number(playlistId))
            form.reset()
            toast.success("Video has been added successfully.")
            router.refresh()
            if (closeWhenDone) {
                setOpen(false)
            }
        } catch {
            toast.error("Unable to add video. Please try again later.")
        }
    }

    useEffect(() => {
        if (videoDurationInSeconds) {
            form.setValue("timestamp", [0, videoDurationInSeconds])
        }
    }, [form, videoDurationInSeconds])

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus /> Add video
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>Add a video</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col w-full space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Youtube URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && <ErrorAlert message={error} />}
                        {loading && <VideoPreviewSkeleton />}
                        {!loading && videoPreviewProps && <VideoPreviewBase {...videoPreviewProps} />}

                        {!loading && videoPreviewProps && (
                            <FormField
                                control={form.control}
                                name="timestamp"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Choose a timestamp</FormLabel>
                                            <FormControl>
                                                <SliderWithInputs
                                                    className="mt-3"
                                                    max={videoDurationInSeconds}
                                                    value={field.value}
                                                    onValueChange={(value) => form.setValue("timestamp", value)}
                                                    renderWithInputs
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                        )}

                        <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="perform_again"
                                    checked={closeWhenDone}
                                    onCheckedChange={() => setCloseWhenDone((prev) => !prev)}
                                />
                                <label
                                    htmlFor="perform_again"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Close this dialog when done
                                </label>
                            </div>
                            <Button
                                className="self-end"
                                type="submit"
                                disabled={!isValid || Boolean(error)}
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export const AddVideoButton = () => {
    return <AddVideoInputForm />
}
