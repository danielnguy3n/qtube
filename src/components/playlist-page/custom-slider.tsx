"use client"

import React, { memo, useEffect, useRef, useState } from "react"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

import SliderWithInputs from "../shared/slider-with-inputs"
import { PlaylistItem } from "@/db/playlist/add-video"
import { updatePlaylistItem } from "@/db/playlist/update-playlist-item"
import { toast } from "sonner"

const formSchema = z.object({
    timestamp: z.number().array(),
})

function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

function BaseCustomSlider({ video }: { video: PlaylistItem }) {
    const hasMounted = useRef(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            timestamp: video.timestamp,
        },
    })

    const debouncedValue = useDebounce<number[]>(form.watch("timestamp"), 300)

    const hasTimestampChanged = debouncedValue[0] !== video.timestamp[0] || debouncedValue[1] !== video.timestamp[1]

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            return
        }

        const handleTimestampChange = async (value: number[]) => {
            try {
                await updatePlaylistItem({ timestamp: value }, video.id)
                router.refresh()
            } catch {
                toast.error("Unable to change timestamp. Please try again.")
            }
        }
        if (hasTimestampChanged) {
            handleTimestampChange(debouncedValue)
        }
    }, [router, video.id, debouncedValue, hasTimestampChanged])

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
                                    onValueChange={(value) => form.setValue("timestamp", value)}
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
