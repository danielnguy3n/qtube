"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updatePlaylistItem } from "@/db/playlist/update-playlist-item"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Must be at least 3 characters.",
    }),
})

export function UpdateVideoNameForm({ videoId, name, onSuccess }: { videoId: number; name: string; onSuccess: () => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name,
        },
    })

    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updatePlaylistItem({ itemName: values.name }, videoId)
            router.refresh()
            onSuccess()
        } catch {
            toast.error("Unable to edit video name. Please try again.")
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Video name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    defaultValue={name}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-row-reverse">
                    <Button type="submit">Update</Button>
                </div>
            </form>
        </Form>
    )
}
