export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-background py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4">{children}</div>
        </div>
    )
}
