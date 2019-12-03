import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import * as CANNON from 'cannon'

import DatGui, {DatBoolean, DatColor, DatNumber, DatString} from 'react-dat-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {CannonProvider, useCannon} from './cannonProvider'

import ModelGJ from './assets/seseme.js'

import {Debug, Range, TinkerGroup} from './components/Debug'
import Camera from './components/core/Camera'

import {toRads, toDegs} from './utils/3d'

function Model({ url }) {
  const model = useLoader(GLTFLoader, url, loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  return <primitive object = {model.scene} />
}

function Ground({position}) {
  const ref = useCannon({mass: 0}, body => {
    body.addShape(new CANNON.Plane())
    body.position.set(...position)
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
  })
  return (
    <mesh ref = {ref}>
      <planeBufferGeometry attach = 'geometry' args = {[100,100]} />
      <meshBasicMaterial attach = 'material' color = {0x000000}/>
    </mesh>
  )
}

function PhysicsBody({position}, visible = true) {
  const ref = useCannon({mass: 10}, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1,1,1)))
    body.position.set(...position)
  })
  return (
    <mesh ref = {ref}>
      <boxGeometry attach = 'geometry' args = {[2,2,2]} />
      <meshNormalMaterial attach = 'material' color = "#FF0000"/>
    </mesh>
  )
}


function App() {

  const [cam, setCam] = useState({
    x: 0, y: 0, z: 20,
    zoom: 1,
    rx: 0, ry: 0, rz: 0,
  })

  return (
    <div className = 'full'>
      <Canvas invalidateFrameLoop>
        <Camera 
          position = {[cam.x, cam.y, cam.z]}
          rotation = {[cam.rx,cam.ry,cam.rz]}
          zoom = {cam.zoom}
        />
        <CannonProvider>
          <Ground position = {[0, -10, 0]} />
          <PhysicsBody position = {[0.8,1,0]} />
          <PhysicsBody position = {[0,3,0.3]} />
        </CannonProvider>

        <Suspense fallback = {(<mesh> <sphereGeometry attach = 'geometry'/></mesh>)}>
          { <ModelGJ /> }
          {/* <Model url = './sese.gltf' /> */}
        </Suspense>
      </Canvas>

      <Debug>
        <TinkerGroup name = 'cam' obj = {cam} func = {setCam} />
      </Debug>
    </div>
  );
}



export default App;
