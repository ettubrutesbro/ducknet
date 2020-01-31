/* a container called by App which passes on common props to its 
children (all the projects)
so they don't have to be manually repeated 

TODO: contexts are pretty confusing - do certain things need to be in context from worldfunc?
should this component have a separate ProjectContext that it passes down for projects only?

*/

import React, {useContext, useState, useEffect} from 'react'
import {cameraContext} from './Camera'

import {WorldFunctions} from '../../App'

function Projects({children}){

    const {cam, setCam} = useContext(cameraContext)

    const {select, selected, abyss} = useContext(WorldFunctions)

    const [alone, projectIsAlone] = useState(null) //for telling a project when the others are all in abyss
    //check if abyss has every project but the selected one
    useEffect(()=>{
        if(abyss.length === children.length-1 && selected){ //need a way to get actual # of projects
          projectIsAlone(selected)
        }
        else projectIsAlone(null)
    }, [abyss, selected])

    return(
        <React.Fragment>
        {children.filter(child => !abyss.includes(child.props.name)).map((child)=>{
            const name = child.props.name
            return React.cloneElement(child, {
                //foisted props
                onClick: () => select(name),
                selected: selected === name,
                onSelect: setCam,
                falling : selected && selected !== name,
                alone: alone === name
            })
        })}
        </React.Fragment>
    )
}

export default Projects