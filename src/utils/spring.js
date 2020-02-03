//attempt at a basic animation hook

import React, {useEffect} from 'react'
import {useSpring} from 'react-spring'

const Spring = (keys, currentKey) =>{

    const [key, setKey, stop] = useSpring(() => keys[currentKey])

    useEffect(()=>{
        stop()
        setKey(keys[currentKey])

    }, [currentKey])
    // console.log(key)
    return key
}


export default Spring

export const SpringEffect = (key, keys, setter, stopper) => 
    useEffect(()=>{
        setter(keys[key])
    }, [key])
