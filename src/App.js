import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import * as CANNON from 'cannon'
import {animated, useSpring} from 'react-spring'


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {PhysicsProvider, usePhysics} from './components/core/Physics'
import {Body} from './components/core/Body'
import {Enclosure} from './components/core/Wall'

import Seseme from './components/projects/seseme'
import Eclipse from './components/projects/Eclipse'
import Scorecard from './components/projects/Scorecard'



import {Debug, Range, TinkerGroup} from './components/Debug'
import Camera from './components/core/Camera'

import {toRads, toDegs} from './utils/3d'


export const SelectionContext = React.createContext()

function App() {

  const [projectCamera, setProjectCamera] = useState(null)
  const [selected, select] = useState(null)


  return (
    <animated.div className = 'full'>
      <Canvas 
        invalidateFrameloop = {false}
        onPointerMissed = {()=> select(null)}
      >

        <PhysicsProvider>
          <Camera 
            projectCamera = {projectCamera}
          />
          <Enclosure /> 
            
            <Scorecard
              position = {[-1,35,0]}
              rotation = {[0,10,0]}

              onClick = {() => select('scorecard')}
              selected = {selected === 'scorecard'}

              onSelect = {setProjectCamera}
            />
            
            <Seseme 
              position = {[-1.5,18,0]} 
              rotation = {[0,35,0]} 
              onClick = {()=>select('seseme')}
              //onClick, selected and onSelect should be distributed
              //automatically via some kind of React.children map..? or <Project />
              selected = {selected==='seseme'}
              onSelect = {setProjectCamera}
          
            /> 
            <Eclipse 
              position = {[2,5,0]} 
              rotation = {[0,0,90]} 
              onClick = {()=>select('eclipse')}

              selected = {selected==='eclipse'}
              onSelect = {setProjectCamera}
            /> 
            
            

        </PhysicsProvider>

      </Canvas>
    {/*
      <Debug>
        {selected}
        <TinkerGroup name = 'cam' obj = {cam} func = {setCam} open />
        
      </Debug>
      */}
    </animated.div>
  );
}



export default App;
