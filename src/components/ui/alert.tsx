import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
    "z-99 relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    {
        variants: {
            variant: {
                default: "bg-card text-card-foreground",
                destructive: "bg-destructive/10 dark:bg-destructive/20 border-destructive/50 dark:border-destructive/70",
                success: "bg-emerald-500/10 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-600/70",
                info: "bg-blue-500/10 dark:bg-blue-600/30 border-blue-300 dark:border-blue-600/70",
                warning: "bg-amber-500/10 dark:bg-amber-600/30 border-amber-300 dark:border-amber-600/70",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
            {...props}
        />
    )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)}
            {...props}
        />
    )
}

export { Alert, AlertTitle, AlertDescription }
