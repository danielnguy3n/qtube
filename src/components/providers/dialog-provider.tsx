"use client"
import React, { createContext, useContext, useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

interface DialogProps {
    title: string
    content: React.ReactNode
}

const DialogContext = createContext<{ openDialog: (value: DialogProps) => void; closeDialog: () => void } | null>(null)

const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false)
    const [dialogProps, setDialogProps] = useState<DialogProps>({ title: "", content: null })

    const openDialog = (dialogProps: DialogProps) => {
        setDialogProps(dialogProps)
        setOpen(true)
    }

    const closeDialog = () => {
        setOpen(false)
    }

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            <Dialog
                open={open}
                onOpenChange={setOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{dialogProps.title}</DialogTitle>
                    </DialogHeader>
                    <div>{dialogProps.content}</div>
                </DialogContent>
            </Dialog>
        </DialogContext.Provider>
    )
}

const useDialog = () => {
    const dialogContext = useContext(DialogContext)

    if (!dialogContext) {
        throw new Error("useConfirmDialog must be used within DialogContext")
    }

    return dialogContext
}

export { DialogProvider, useDialog }
