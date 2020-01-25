/* 
wrapper for storybook that incl. a canvas with context(?) and project-addressable-camera
this could be the foundation for a slight refactor of how context / camera are handled in App

    <PreviewCanvas>
        <SCModel
            pose = {knobForPose}
        />
    </PreviewCanvas>

*/

import React, {useContext, useState, useEffect} from 'react'
import { Canvas } from 'react-three-fiber'
import Camera from './core/Camera'

import {toRads} from '../utils/3d'

export const CamContext = React.createContext({
    cam: 'hello',
    setCam: (v)=>console.log(v)
})

function PreviewCanvas({debugCamera, children}) {

    const [cam, setCam] = useState(null)
    useEffect(()=>{
        if(debugCamera) setCam(debugCamera)
    }, [debugCamera])

    return <Canvas>
        <CamContext.Provider 
            value = {{
                cam: cam,
                setCam: setCam
            }}
        >
        <Camera />
        {children}
        </CamContext.Provider>

    </Canvas>

}

export default PreviewCanvas