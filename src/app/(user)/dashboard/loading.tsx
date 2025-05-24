import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
                <Skeleton className="w-40 h-9" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {new Array(3).fill(0).map((_, i) => (
                    <Card
                        key={i}
                        className="overflow-hidden transition-all hover:shadow-md hover:bg-accent"
                    >
                        <div className="aspect-video relative overflow-hidden">
                            <Skeleton className="rounded-xl w-full h-80" />
                        </div>
                        <CardContent className="flex flex-col py-4 gap-2">
                            <Skeleton className="w-40 h-4" />
                            <Skeleton className="w-20 h-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}
