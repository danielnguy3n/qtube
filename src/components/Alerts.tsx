import React from "react"
import { Alert, AlertTitle } from "./ui/alert"
import { AlertCircle, CircleCheck, CircleFadingArrowUpIcon, ShieldAlert } from "lucide-react"

interface AlertProps {
    message: string
}

export function ErrorAlert({ message }: AlertProps) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{message}</AlertTitle>
        </Alert>
    )
}

export function SuccessAlert({ message }: AlertProps) {
    return (
        <Alert variant="success">
            <CircleCheck className="h-4 w-4 !text-emerald-500" />
            <AlertTitle>{message}</AlertTitle>
        </Alert>
    )
}

export function InfoAlert({ message }: AlertProps) {
    return (
        <Alert className="bg-blue-500/10 dark:bg-blue-600/30 border-blue-300 dark:border-blue-600/70">
            <CircleFadingArrowUpIcon className="h-4 w-4 !text-blue-500" />
            <AlertTitle>Error: {message}</AlertTitle>
        </Alert>
    )
}

export function WarningAlert({ message }: AlertProps) {
    return (
        <Alert className="bg-amber-500/10 dark:bg-amber-600/30 border-amber-300 dark:border-amber-600/70">
            <ShieldAlert className="h-4 w-4 !text-amber-500" />
            <AlertTitle>Error: {message}</AlertTitle>
        </Alert>
    )
}
