import { Tooltip as PrimitiveTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Tooltip({ children, content }: { children: React.ReactNode; content: (() => React.ReactNode) | React.ReactNode }) {
    return (
        <TooltipProvider>
            <PrimitiveTooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="bottom">{typeof content == "function" ? content() : <p className="font-bold">{content}</p>}</TooltipContent>
            </PrimitiveTooltip>
        </TooltipProvider>
    )
}
