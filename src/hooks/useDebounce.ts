import { debounce } from "@/lib/utils"
import { useEffect, useMemo, useRef } from "react"

const useDebounce = <T extends unknown[], S>(callback: (...args: T) => S, delay: number = 300) => {
    const ref = useRef(callback)

    useEffect(() => {
        ref.current = callback
    }, [callback])

    const debouncedCallback = useMemo(() => {
        // pass arguments to callback function
        const func = (...arg: T) => {
            return ref.current(...arg)
        }

        return debounce(func, delay)
        // or just debounce(ref.current, delay)
    }, [delay])

    return debouncedCallback
}

export default useDebounce
