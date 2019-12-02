import React from 'react'
import styled from 'styled-components'
import {Canvas, useFrame, useRender} from 'react-three-fiber'
import * as CANNON from 'cannon'
import {CannonProvider, useCannon} from '../cannonProvider'

// import {addDecorator} from '@storybook/react'
import { withContexts } from '@storybook/addon-contexts/react';
 
export default { 
	title: 'POC',
	decorators: [
		storyFn => <CannonProvider> {storyFn()} </CannonProvider>
	]  
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

export const r3fcannon = () => {
	// const ref = useCannon({mass: 100000}, body => {
 //    body.addShape(new CANNON.Box(new CANNON.Vec3(1,1,1)))
 //    body.position.set(1,0,1)
	//   })
	return(
		<Container>
			<Canvas>
				<mesh ref = {ref}>
					<boxGeometry attach = 'geometry' args = {[1,1,1]} />
					<meshNormalMaterial attach = 'material' />
				</mesh>
			</Canvas>
		</Container>
	)
}
r3fcannon.story = {name: 'w/ cannon'}

const Container = styled.div`
	border: 1px solid black;
`