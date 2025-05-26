import { useEffect, useState } from "react"
import { YoutubeVideo } from "@/types/youtube"

import { useSession } from "next-auth/react"

interface UseYoutubeVideoReturnProps {
    data: YoutubeVideo | null
    loading: boolean
    error: string | null
}

export default function useYoutubeVideo(videoId: string | null): UseYoutubeVideoReturnProps {
    const { data: session } = useSession()
    const [data, setData] = useState<YoutubeVideo | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setError("")
        if (!session?.accessToken || !videoId || videoId.length !== 11) {
            if (!session?.accessToken) {
                setError("No access token found")
            }
            setData(null)
            return
        }
        setLoading(true)
        fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.items[0])
                setError(null)
            })
            .catch((e) => {
                if (e.code === 403) {
                    setError("“We couldn't access your YouTube data. Please make sure you've signed in to YouTube at least once.")
                } else {
                    setError("Failed to fetch video")
                }
                setData(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [session, videoId])

    return { data, loading, error }
}
