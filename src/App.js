import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import * as CANNON from 'cannon'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


import {PhysicsProvider, usePhysics} from './components/core/Physics'
import {SimpleBody} from './components/core/Body'
import {Enclosure} from './components/core/Wall'

import Seseme from './components/projects/seseme'
import Eclipse from './components/projects/Eclipse'



import {Debug, Range, TinkerGroup} from './components/Debug'
import Camera from './components/core/Camera'

import {toRads, toDegs} from './utils/3d'


function App() {

  const [cam, setCam] = useState({
    x: 0, y: 21, z: 50,
    zoom: 1,
    rx: toRads(-18), ry: 0, rz: 0,
    fov: 25,
    orbit: true
  })


  return (
    <div className = 'full'>
      

      <Canvas 
        invalidateFrameloop = {false}
      >
        <Camera 
          position = {[cam.x, cam.y, cam.z]}
          rotation = {[cam.rx,cam.ry,cam.rz]}
          zoom = {cam.zoom}
          fov = {cam.fov}
          debugWithOrbit = {cam.orbit}
        />

        <PhysicsProvider>
          <Enclosure /> 

          { <Seseme position = {[0,10,0]} rotation = {[5,35,-3]} /> }
          { <Eclipse position = {[1.5,5,.5]} rotation = {[0,0,15]} /> }

        </PhysicsProvider>

      </Canvas>

      <Debug>
        <TinkerGroup name = 'cam' obj = {cam} func = {setCam} open />
      </Debug>
    </div>
  );
}



export default App;
