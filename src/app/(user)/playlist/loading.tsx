import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                >
                    <Link href="/dashboard">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <Skeleton className="w-40 h-6" />
            </div>

            <div className="relative w-full bg-black rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                    <Skeleton className="w-full h-full" />
                </div>
            </div>

            <div className="mt-4 mb-6">
                <Skeleton className="w-80 h-6" />
                <Skeleton className="w-40 h-4 mt-1" />
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="w-60 h-6" />
                    <Skeleton className="w-40 h-9" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="w-full h-[148px]" />
                    <Skeleton className="w-full h-[148px]" />
                </div>
            </div>
        </div>
    )
}
