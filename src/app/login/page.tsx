import Link from "next/link"
import { Play } from "lucide-react"
import { SignInGoogleButton } from "@/components/shared/sign-in-google-button"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background dark:bg-black/95 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 mb-2"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
                            <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">QTube</span>
                    </Link>
                    <h1 className="text-3xl font-bold mt-8 mb-2">Welcome</h1>
                    <p className="text-muted-foreground">Sign in to access your playlists</p>
                </div>

                <div className="mt-10">
                    <SignInGoogleButton />
                </div>
            </div>
        </div>
    )
}
