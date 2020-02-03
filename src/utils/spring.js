//attempt at a basic animation hook

import {useEffect} from 'react'
import {useSpring} from 'react-spring'

const useMySpring = (keys, currentKey) =>{

    const [key, setKey, stop] = useSpring(() => keys[currentKey])

    useEffect(()=>{
        stop()
        setKey(keys[currentKey])

    }, [currentKey])
    // console.log(key)
    return key
}


export default useMySpring

export const SpringEffect = (key, keys, setter, stopper) => 
    useEffect(()=>{
        setter(keys[key])
    }, [key])
