/* 
wrapper for storybook that incl. a canvas with context(?) and project-addressable-camera
this could be the foundation for a slight refactor of how context / camera are handled in App

    <PreviewCanvas>
        <SCModel
            pose = {knobForPose}
        />
    </PreviewCanvas>

*/

import React from 'react'
import { Canvas } from 'react-three-fiber'
import Camera, {CameraProvider} from './core/Camera'


function PreviewCanvas({debugCamera, children}) {

    return <Canvas>
            <CameraProvider debugCamera = {debugCamera}>
                {children}
            </CameraProvider>
        </Canvas>

}

export default PreviewCanvas