/* 
    hook for objects to force pos/rot and setA (for HUD line) on selection
    so i don't have to repeat this code for every project

    useObjectSelection(
        'project name',
        selected,
        {position: [x,y,z], rotation: [x,y,z]},
        refOfLineNode.current
    )

    returns forced position / rotation as object (replacing force useState from before)
    but carries side effects like calling setA from app's userStore
*/

import React, {useEffect, useState} from 'react'
import {userStore} from '../../App'

function useObjectSelection(name, selected, goTo, lineNodeRef){

    const setA = userStore(store => store.setA)
    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            console.log('\nSELECTED:', name)
            forceTo(goTo)
            setA(lineNodeRef)
        }
        else{
            console.log('\nDESELECTED:', name)
            forceTo(null)
            setA(null)

        }

    }, [selected, lineNodeRef])

    return forced

}

export default useObjectSelection