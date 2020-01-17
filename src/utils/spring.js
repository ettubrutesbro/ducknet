//attempt at a basic animation hook

import {useState, useEffect} from 'react'
import {useSpring} from 'react-spring'

export const Spring = (keys, currentKey) => {

    const [key, setKey] = useSpring(() => keys[currentKey])

    useEffect(()=>{
        setKey(keys[currentKey])
    }, [currentKey])

    return key
}