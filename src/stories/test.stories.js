import React, {Suspense} from 'react'

import {withKnobs, text, boolean, number} from '@storybook/addon-knobs'

import styled from 'styled-components'
import {useSpring, animated} from 'react-spring'
import {Canvas, useFrame, useRender} from 'react-three-fiber'
import * as CANNON from 'cannon'


import {toRads} from '../utils/3d'

import SCModel from '../components/projects/Scorecard/SCModel'
import Camera from '../components/core/Camera'



// import {addDecorator} from '@storybook/react'
import { withContexts } from '@storybook/addon-contexts/react';
 
export default { 
    title: 'Project models',
    decorators: [withKnobs]
}

export const scorecard = () => {

    const select = boolean('selected', false)
    const pseudoToggle = boolean('pseudo UI', false)
    const bldgToggle = boolean('bldg', false)

    const camX = number('camera X', 0, 'cam')
    const camY = number('camera Y', 3, 'cam')
    const camZ = number('camera Z', 70, 'cam')
    const camRX = number('cam rot X', 0, 'cam')
    const camRY = number('cam rot Y', 7, 'cam')
    const camRZ = number('cam rot Z', 0, 'cam')

    const modelRX = number('model rot X', 0, 'model')
    const modelRY = number('model rot Y', 0, 'model')
    const modelRZ = number('model rot Z', 0, 'model')

    return(
        <Container>
            <Canvas>
                <Camera 
                    // debugWithOrbit
                    projectCamera = {{
                        fov: 29,
                        position: [camX,camY,camZ],
                        rotation: [toRads(camRX),toRads(camRY),toRads(camRZ)]
                    }}
                />
                <Suspense fallback = {<React.Fragment />}>
                    <SCModel 
                        showPseudo = {pseudoToggle}
                        showBldg = {bldgToggle}
                        selected = {select}
                        rotation = {[toRads(modelRX),toRads(modelRY),toRads(modelRZ)]}
                    />
                </Suspense>
            </Canvas>
        </Container>
    )
}

const Container = styled.div`
    border: 1px solid black;
    height: 1080px;
    width: 100%;
`

const xyz = (label, defaults = [0,0,0]) => {
    let xyz = {
        x: number(`${label} x`, defaults[0], label+'group'),
        y: number(`${label} y`, defaults[1], label+'group'),
        z: number(`${label} z`, defaults[2], label+'group'),
    }
    return xyz
}
