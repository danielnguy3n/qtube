"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"

import { Slider } from "@/components/ui/slider"
import { Input } from "../ui/input"
import { memo, useEffect, useState } from "react"
import { durationStringToSeconds, convertDurationToString, formatInputIntoString } from "@/lib/utils"

type SliderWithInputsProps = React.ComponentProps<typeof SliderPrimitive.Root> & { renderWithInputs?: boolean }

function BaseSliderWithInputs({ className, defaultValue, value, min = 0, max = 100, onValueChange, renderWithInputs = false, ...props }: SliderWithInputsProps) {
    const [time, setTime] = useState(value ? [...value] : [min, max])

    useEffect(() => {
        if (value) {
            setTime([...value])
        }
    }, [value])

    const onChange = (value: number[]) => {
        setTime(value)
        if (onValueChange && value) {
            onValueChange(value)
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select()
    }

    const onStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const formattedString = formatInputIntoString(value)

        const seconds = durationStringToSeconds(formattedString)
        const timestamp = seconds > time[1] ? time[1] : seconds

        onChange([timestamp, time[1]])
    }

    const onEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const formattedString = formatInputIntoString(value)

        const seconds = durationStringToSeconds(formattedString)
        const timestamp = seconds > max ? max : seconds < time[0] ? time[0] : seconds

        onChange([time[0], timestamp])
    }

    return (
        <div className="w-full">
            <Slider
                className={className}
                defaultValue={defaultValue}
                value={value}
                max={max}
                onValueChange={onChange}
                {...props}
            />
            <div className="mt-4 flex justify-between items-center text-md font-medium text-muted-foreground">
                <div className="w-20 items-center gap-1.5">
                    <Input
                        className="text-center"
                        type="text"
                        id="start"
                        value={convertDurationToString(time[0])}
                        onChange={onStartInputChange}
                        onFocus={handleFocus}
                        disabled={!renderWithInputs}
                    />
                </div>
                <div className="w-20 items-center gap-1.5">
                    <Input
                        className="text-center"
                        type="text"
                        id="end"
                        value={convertDurationToString(time[1])}
                        onChange={onEndInputChange}
                        onFocus={handleFocus}
                        disabled={!renderWithInputs}
                    />
                </div>
            </div>
        </div>
    )
}

const SliderWithInputs = memo(BaseSliderWithInputs)

export default SliderWithInputs
