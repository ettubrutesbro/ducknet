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

    return(
        <Container>
            <Canvas>
                <Camera 
                    debugWithOrbit
                />
                <Suspense fallback = {<React.Fragment />}>
                    <SCModel 
                        showPseudo = {pseudoToggle}
                        selected = {select}
                    />
                </Suspense>
            </Canvas>
        </Container>
    )
}

const Container = styled.div`
    border: 1px solid black;
    height: 720px;
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
