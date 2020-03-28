import React, {useRef, useEffect} from 'react'
export default function usePrevious(value){
    //usePrevious({propWantedForComparison})
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}