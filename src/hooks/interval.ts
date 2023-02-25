import { useEffect, useRef } from "react"

export const useInterval  = (callback: () => void, delay: number): void => {
    const callbackF = useRef<() => void>()

    // overwrite a reference to the actual callback function
    useEffect(() => {
        callbackF.current = callback;
    }, [callback])

    // run the interval
    useEffect(() => {
        // wrap the call
        const intervalfunc = () => callbackF.current!();

        // setup the interval
        if (delay !== null) {
            const timer = setInterval(intervalfunc, delay)
            
            // cleanup
            return () => clearInterval(timer)
        }
    }, [delay])
}