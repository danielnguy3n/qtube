"use client"

import { useRouter } from "next/navigation"

import { Button } from "../ui/button"

import { ListMusic } from "lucide-react"

export default function HomeButton() {
    const router = useRouter()

    const handleClick = () => {
        router.push("/dashboard")
    }
    return (
        <Button
            onClick={handleClick}
            variant="default"
            className="flex justify-center items-center"
        >
            <ListMusic />
            Playlists
        </Button>
    )
}
