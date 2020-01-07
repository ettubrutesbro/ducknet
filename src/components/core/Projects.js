/* a container called by App which passes on common props to its 
children (all the projects)
so they don't have to be manually repeated 

abyss inclusion conditional render
selected, falling, 

*/
import React, {useContext} from 'react'

import {WorldFunctions} from '../../App'

function Projects({children}){

    const {select, selected, abyss, setProjectCamera, alone} = useContext(WorldFunctions)

    //maybe report # of children back up to App so it knows what do with abyss?
    //or maybe i actually want to control that here. 
    return(
        <React.Fragment>
        {children.filter(child => !abyss.includes(child.props.name)).map((child)=>{
            const name = child.props.name
            return React.cloneElement(child, {
                //foisted props
                onClick: () => select(name),
                selected: selected === name,
                onSelect: setProjectCamera,
                falling : selected && selected !== name,
                alone: alone === name
            })
        })}
        </React.Fragment>
    )
}

export default Projects