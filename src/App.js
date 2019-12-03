import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import * as CANNON from 'cannon'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


import {PhysicsProvider, usePhysics} from './components/core/Physics'
import {Body, LoadingProject} from './components/core/Body'
import {Wall} from './components/core/Wall'

import Seseme from './components/projects/seseme'



import {Debug, Range, TinkerGroup} from './components/Debug'
import Camera from './components/core/Camera'

import {toRads, toDegs} from './utils/3d'


function App() {

  const [cam, setCam] = useState({
    x: 0, y: 3, z: 20,
    zoom: 1,
    rx: toRads(-15), ry: 0, rz: 0,
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
        />

        <PhysicsProvider>
          <Wall position = {[0, -5, 0]} rotation = {[-90, 0, 0]} size = {[11,5,.5]}/>
          <Wall position = {[5, 0, 0]} rotation = {[0, -90, 0]} size = {[5,11,.5]} />
          <Wall position = {[-5, 0, 0]} rotation = {[0, 90, 0]} size = {[5,11,.5]}/>
          <Wall position = {[0, 0, -3]} rotation = {[0, 0, 0]} visible={true}/>
          <Wall position = {[0, 0, 3]} rotation = {[0, 0, 0]} visible={true}/>
          {/*
          <Body position = {[0,5,0]} />
          <Body position = {[.5,10,0.25]} />
          <Body position = {[-0.25,15,-.25]} />
          */}

          <Seseme position = {[0,5,0]} rotation = {[5,35,-3]}/>
        </PhysicsProvider>

      </Canvas>

      <Debug>
        <TinkerGroup name = 'cam' obj = {cam} func = {setCam} />
      </Debug>
    </div>
  );
}



export default App;
