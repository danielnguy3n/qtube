"use client"

import { useSession } from "next-auth/react"

import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"

import { login, logout } from "@/lib/auth"

import { CircleUserRound, LogIn, LogOut } from "lucide-react"
import Image from "next/image"

export default function AccountButton() {
    const { data: session, status } = useSession()
    const user = session?.user

    const handleClick = () => {
        if (status === "authenticated") {
            logout()
        } else {
            login()
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full size-9 flex justify-center items-center"
                >
                    {user && user.image ? (
                        <Image
                            className="size-9 rounded-full"
                            src={user.image}
                            alt="Profile Picture"
                            width={36}
                            height={36}
                        />
                    ) : (
                        <CircleUserRound className="size-6" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="end"
                sideOffset={22}
                className="w-full h-full"
            >
                {user && (
                    <>
                        <div className="flex gap-3 px-4 py-2 items-center">
                            {user.image && (
                                <Image
                                    className="size-9 rounded-full"
                                    src={user.image}
                                    alt="Profile Picture"
                                    width={36}
                                    height={36}
                                />
                            )}
                            <div>
                                <p className="font-bold"> {user.name} </p>
                                <p className="text-sm">{user.email}</p>
                            </div>
                        </div>
                        <Separator />
                    </>
                )}
                <Button
                    onClick={handleClick}
                    variant="ghost"
                    className="w-full flex gap-2 items-center justify-start"
                >
                    {status === "authenticated" ? (
                        <>
                            <LogOut className="size-4" />
                            <p>Sign out</p>
                        </>
                    ) : (
                        <>
                            <LogIn className="size-4" />
                            <p>Sign in with Google</p>
                        </>
                    )}
                </Button>
            </PopoverContent>
        </Popover>
    )
}
