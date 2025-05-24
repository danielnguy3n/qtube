import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import AccountButton from "@/components/layout/account-button"
import { ConfirmDialogProvider } from "@/components/providers/confirm-dialog-provider"
import { DialogProvider } from "@/components/providers/dialog-provider"
import QueryProvider from "@/components/providers/query-client-provider"

export const dynamic = "force-dynamic"

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-background py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
                <div className="flex flex-row-reverse gap-4 items-center">
                    <AccountButton />
                    {/* <HomeButton /> */}
                </div>
                {children}
            </div>
        </div>
    )
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster richColors />
            <QueryProvider>
                <SessionProvider>
                    <DialogProvider>
                        <ConfirmDialogProvider>
                            <MainLayout>{children}</MainLayout>
                        </ConfirmDialogProvider>
                    </DialogProvider>
                </SessionProvider>
            </QueryProvider>
        </>
    )
}
