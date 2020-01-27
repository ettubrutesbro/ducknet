//attempt at a basic animation hook

import {useEffect} from 'react'
import {useSpring} from 'react-spring'

export const Spring = (keys, currentKey) => {

    const [key, setKey, stop] = useSpring(() => keys[currentKey])

    useEffect(()=>{
        stop()
        setKey(keys[currentKey])
    }, [currentKey])

    return key
}