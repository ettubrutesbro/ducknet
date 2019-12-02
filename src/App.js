import React, {useState, useEffect, useContext, useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, useRender } from 'react-three-fiber'
import styled from 'styled-components'
import * as CANNON from 'cannon'

import {CannonProvider, useCannon} from './cannonProvider'

function Ground({position}) {
  const ref = useCannon({mass: 0}, body => {
    body.addShape(new CANNON.Plane())
    body.position.set(...position)
  })
  return (
    <mesh ref = {ref}>
      <planeBufferGeometry attach = 'geometry' args = {[100,100]} />
      <meshNormalMaterial attach = 'material' />
    </mesh>
  )
}

function Stuff({position}) {
  const ref = useCannon({mass: 100000}, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1,1,1)))
    body.position.set(...position)
  })
  return (
    <mesh ref = {ref}>
      <boxGeometry attach = 'geometry' args = {[2,2,2]} />
      <meshLambertMaterial attach = 'material' color = "#FF0000"/>
    </mesh>
  )
}

function Thing() {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))
  return (
    <mesh
      ref={ref}
      onClick={e => console.log('click')}
      onPointerOver={e => console.log('hover')}
      onPointerOut={e => console.log('unhover')}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}


function App() {
  return (
    <div className="App">
      <h1> hello world </h1>



      <DuckCanvas>
        <CannonProvider>
          <Ground position = {[0, 0, -10]} />
          <Stuff position = {[1,0,1]} />
          <Stuff position = {[1.5,0,2]} />
        </CannonProvider>
      </DuckCanvas>
    </div>
  );
}

const DuckCanvas = styled(Canvas)`
  outline: 1px solid black;
`

export default App;
