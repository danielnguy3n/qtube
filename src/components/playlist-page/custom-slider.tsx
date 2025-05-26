"use client"

import React, { memo } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

import { usePlaylistStore } from "@/store/store"

import SliderWithInputs from "../shared/slider-with-inputs"
import { PlaylistItem } from "@/db/playlist/add-video"
import { updatePlaylistItem } from "@/db/playlist/update-playlist-item"
import { PLAYER_STATUS } from "./youtube-player"
import useDebounceFunction from "@/hooks/useDebounce"

const formSchema = z.object({
    timestamp: z.number().array(),
})

// function useDebounce<T>(value: T, delay: number) {
//     const [debouncedValue, setDebouncedValue] = useState(value)

//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedValue(value)
//         }, delay)

//         return () => {
//             clearTimeout(handler)
//         }
//     }, [value, delay])

//     return debouncedValue
// }

function BaseCustomSlider({ video }: { video: PlaylistItem }) {
    const router = useRouter()

    const activeVideo = usePlaylistStore((state) => state.activeVideo)
    const player = usePlaylistStore((state) => state.player)
    const playerState = usePlaylistStore((state) => state.playerState)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            timestamp: video.timestamp,
        },
    })

    const handleTimestampChange = async (value: number[]) => {
        try {
            await updatePlaylistItem({ timestamp: value }, video.id)

            if (video.id === activeVideo?.id && player) {
                // Changing timestamp for video that is cued. i.e. On mount, when video hasnt started playing yet.
                if (playerState === PLAYER_STATUS.videoCued) {
                    player.cueVideoById({
                        videoId: video.videoId,
                        startSeconds: value[0],
                        endSeconds: value[1],
                    })
                }

                // Changing timestamp for video that is playing/paused
                const currentTime = await player.getCurrentTime()
                if (playerState === PLAYER_STATUS.playing || playerState === PLAYER_STATUS.paused) {
                    if (currentTime < value[1]) {
                        await player.loadVideoById({
                            videoId: video.videoId,
                            startSeconds: currentTime,
                            endSeconds: value[1],
                        })
                    }

                    if (currentTime < value[0]) {
                        await player.loadVideoById({
                            videoId: video.videoId,
                            startSeconds: value[0],
                            endSeconds: value[1],
                        })
                    }
                }
            }
            router.refresh()
        } catch {
            toast.error("Unable to change timestamp. Please try again.")
        }
    }

    const debouncedHandleTimestampChange = useDebounceFunction(handleTimestampChange)

    async function onSubmit() {}

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full space-y-4"
            >
                <FormField
                    control={form.control}
                    name="timestamp"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <SliderWithInputs
                                    className="mt-3"
                                    max={video.duration}
                                    value={field.value}
                                    onValueChange={(value) => {
                                        debouncedHandleTimestampChange(value)
                                        form.setValue("timestamp", value)
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

const CustomSlider = memo(BaseCustomSlider)

export default CustomSlider
