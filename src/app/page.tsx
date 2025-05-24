import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Play, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SignInGoogleButton } from "@/components/shared/sign-in-google-button"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background dark:bg-black/95 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            {/* Navigation */}
            <header className="border-b border-border">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                                    <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold">QTube</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <SignInGoogleButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="animate-fade-in">
                <section className="py-10 md:py-18">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1 text-center md:text-left mx-auto md:mx-0">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                                    Organize your videos with <br /> <span className="text-primary">QTube</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                                    Create, manage, and share your video collections. The ultimate playlist manager for content creators and video enthusiasts.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Button
                                        size="lg"
                                        className="gap-2"
                                        asChild
                                    >
                                        <Link href="/login">
                                            Get Started <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="w-[90%] lg:flex-1 relative">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border shadow-2xl">
                                    <Image
                                        src="https://i.ytimg.com/vi/ubNfkpbxXUs/sddefault.jpg"
                                        className="object-cover transition-all group-hover:bg-black/20"
                                        alt="QTube Dashboard"
                                        fill
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center">
                                                <Play className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sm">Nature Documentaries</h3>
                                                <p className="text-xs text-muted-foreground">32 videos • Updated 2 days ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="features"
                    className="py-10"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage your videos</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Powerful features designed to help you organize, discover, and enjoy your video content.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Layers className="h-6 w-6" />,
                                    title: "Organize Collections",
                                    description: "Create and manage multiple playlists to keep your videos organized by topic, project, or mood.",
                                },
                                {
                                    icon: <Play className="h-6 w-6" />,
                                    title: "Continuous Playback",
                                    description: "Enjoy uninterrupted viewing with automatic playback of the next video in your playlist.",
                                },
                                {
                                    icon: <CheckCircle2 className="h-6 w-6" />,
                                    title: "Custom Order",
                                    description: "Arrange videos in any order with drag-and-drop functionality for the perfect sequence.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-card dark:bg-black/40 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
