import React from 'react'
import styled from 'styled-components'
import {useSpring, animated} from 'react-spring'
import {Canvas, useFrame, useRender} from 'react-three-fiber'
import * as CANNON from 'cannon'



// import {addDecorator} from '@storybook/react'
import { withContexts } from '@storybook/addon-contexts/react';
 
export default { 
    title: 'POC',

}

export const wtf = () => <div> fuck you </div>

wtf.story = {
    name: 'POC1'
}

export const r3ftest = () => {
    return(
        <Container>
            <Canvas>
                <mesh>
                    <boxGeometry attach = 'geometry' args = {[1,1,1]} />
                    <meshNormalMaterial attach = 'material' />
                </mesh>
            </Canvas>
        </Container>
    )
}

export const springTest = () => {
    const what = useSpring({v: 10, from: {v: 0}})
    console.log(what.v)
    return(
        <animated.div>
            {what.v}
        </animated.div>
    )
}



const Container = styled.div`
    border: 1px solid black;
`