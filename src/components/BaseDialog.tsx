import React, { ReactNode } from "react"

import { Dialog as PrimitiveDialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DialogProps {
    trigger: ReactNode
    content: ReactNode
    title: ReactNode
    submit?: ReactNode
}

const BaseDialog: React.FC<DialogProps> = ({ trigger, content, title }) => {
    return (
        <PrimitiveDialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </PrimitiveDialog>
    )
}

export default BaseDialog
