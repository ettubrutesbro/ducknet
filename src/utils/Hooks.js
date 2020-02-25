import React, {useRef, useEffect} from 'react'
export function usePrevious(value){
    //usePrevious({propWantedForComparison})
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}