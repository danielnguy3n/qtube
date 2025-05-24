"use client"

import React, { useState } from "react"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormState } from "react-hook-form"
import { z } from "zod"

import { createPlaylist } from "@/db/playlists/createPlaylist"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ErrorAlert } from "../Alerts"

import { Plus } from "lucide-react"

const youtubeUrlFormSchema = z.object({
    name: z.string().min(3),
})

export function CreatePlaylistButton() {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")

    const router = useRouter()

    const form = useForm<z.infer<typeof youtubeUrlFormSchema>>({
        resolver: zodResolver(youtubeUrlFormSchema),
        defaultValues: {
            name: "",
        },
    })

    const { isValid } = useFormState({ control: form.control })

    async function onSubmit(data: z.infer<typeof youtubeUrlFormSchema>) {
        const { name } = data
        try {
            setError("")
            const id = await createPlaylist(name)
            router.push(`/playlist/${id}`)
            setOpen(false)
            form.reset()
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e)
            setError(errorMessage)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button className="flex justify-center items-center">
                    <Plus />
                    Create Playlist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Create a playlist</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col w-full space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Playlist Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {error && <ErrorAlert message={error} />}

                        <Button
                            className="self-end"
                            type="submit"
                            disabled={!isValid}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
