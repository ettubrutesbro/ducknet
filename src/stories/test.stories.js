import React, {useEffect, Suspense} from 'react'

import {withKnobs, text, boolean, number} from '@storybook/addon-knobs'

import styled from 'styled-components'
import {useSpring, animated} from 'react-spring'
import {Canvas, useFrame, useRender} from 'react-three-fiber'
import * as CANNON from 'cannon'


import {toRads} from '../utils/3d'

import SCModel from '../components/projects/Scorecard/SCModel'
import Camera from '../components/core/Camera'

import PreviewCanvas from '../components/PreviewCanvas'

// import {addDecorator} from '@storybook/react'
import { withContexts } from '@storybook/addon-contexts/react';
 
export default { 
    title: 'Project models',
    decorators: [withKnobs]
}

export const scorecard = () => {

    const posed = boolean('pose? (is selected)', false, 'pose')
    const pose = number('pose #', 0, {}, 'pose')

    const debugCam = boolean('debug cam?', false, 'cam')
    const camX = number('camera X', 0, {}, 'cam')
    const camY = number('camera Y', 3, {}, 'cam')
    const camZ = number('camera Z', 70, {}, 'cam')
    const camRX = number('cam rot X', 0, {}, 'cam')
    const camRY = number('cam rot Y', 7, {}, 'cam')
    const camRZ = number('cam rot Z', 0, {}, 'cam')
    const camFOV = number('cam FOV', 30, {}, 'cam')

    const modelRX = number('model rot X', 0, {}, 'model')
    const modelRY = number('model rot Y', 0, {}, 'model')
    const modelRZ = number('model rot Z', 0, {}, 'model')

    return(
        <Container>
            <PreviewCanvas
                debugCamera = {debugCam? {position: [camX, camY, camZ], rotation: [toRads(camRX), toRads(camRY), toRads(camRZ)], fov: camFOV} : null}
            >

                <Suspense fallback = {<React.Fragment />}>
                    <group rotation = {[toRads(modelRX),toRads(modelRY),toRads(modelRZ)]} >
                    <SCModel 
                        position = {[0,0,0]}
                        forcePose = {posed? pose: null} //should soon supersede the 'showX' stuff below
                        selected = {posed? pose: false}
                    />
                    </group>
                </Suspense>
            </PreviewCanvas>
        </Container>
    )
}

const Container = styled.div`
    border: 1px solid black;
    height: 1080px;
    width: 100%;
`