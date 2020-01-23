/* 
wrapper for storybook that incl. a canvas with context(?) and project-addressable-camera
this could be the foundation for a slight refactor of how context / camera are handled in App
*/

import React from 'react'
import { Canvas } from 'react-three-fiber'
import Camera from './core/Camera'

function PreviewCanvas(props) {

    <Canvas>
        <Camera>
    </Canvas>

}