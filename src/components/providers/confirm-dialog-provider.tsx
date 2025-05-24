"use client"
import React, { createContext, useContext, useState } from "react"
import { VariantProps } from "class-variance-authority"

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button, buttonVariants } from "../ui/button"

interface ConfirmProps {
    dialogProps: {
        title: string
        message: string
    }
    buttonProps: {
        variant: VariantProps<typeof buttonVariants>["variant"]
        label: string
    }
}

const ConfirmDialogContext = createContext<((value: ConfirmProps) => Promise<void>) | null>(null)

const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false)
    const [dialogProps, setDialogProps] = useState<ConfirmProps["dialogProps"]>({ title: "", message: "" })
    const [buttonProps, setButtonProps] = useState<ConfirmProps["buttonProps"]>({ variant: "default", label: "Confirm" })
    const [resolve, setResolveFn] = useState<() => void>(() => {})
    const [reject, setRejectFn] = useState<(e: string) => void>(() => {})

    const handleConfirm = () => {
        resolve()
        setOpen(false)
    }

    const handleCancel = () => {
        reject("Confirmation Reject")
        setOpen(false)
    }

    const confirm = ({ dialogProps, buttonProps }: ConfirmProps) => {
        setOpen(true)
        setDialogProps(dialogProps)
        setButtonProps(buttonProps)

        return new Promise<void>((resolve, reject) => {
            setResolveFn(() => resolve)
            setRejectFn(() => reject)
        })
    }

    return (
        <ConfirmDialogContext.Provider value={confirm}>
            {children}
            <Dialog
                open={open}
                onOpenChange={setOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{dialogProps.title}</DialogTitle>
                    </DialogHeader>
                    <div>{dialogProps.message}</div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                tabIndex={-1}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant={buttonProps.variant}
                            onClick={handleConfirm}
                        >
                            {buttonProps.label}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmDialogContext.Provider>
    )
}

const useConfirmDialog = () => {
    const confirmDialogContext = useContext(ConfirmDialogContext)

    if (!confirmDialogContext) {
        throw new Error("useConfirmDialog must be used within ConfirmDialogContext")
    }

    return confirmDialogContext
}

export { ConfirmDialogProvider, useConfirmDialog }
