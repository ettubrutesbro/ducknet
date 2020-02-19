import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import create from 'zustand'
import shallow from 'zustand/shallow'

import * as CANNON from 'cannon'

import {PhysicsProvider, usePhysics} from './components/core/Physics'
import {Body} from './components/core/Body'
import {Enclosure} from './components/core/Wall'

import Seseme from './components/projects/seseme'
import Eclipse from './components/projects/Eclipse'
import Scorecard, {SCBlurb, SCPage} from './components/projects/Scorecard/'

import {CameraProvider} from './components/core/Camera'

import Projects from './components/core/Projects'
 
import {toRads, toDegs} from './utils/3d'
import {DumbCube} from './utils/DumbCube'
import {LineTo} from './utils/LineTo'

export const [userStore] = create(set => ({
  selected: null, select: v => set({selected: v}),
  studying: null, study: v => set({studying: v}),
})) 


function App() {

  const {select, selected, study, studying} = userStore(store => ({
    select: store.select,
    selected: store.selected,
    study: store.study,
    studying: store.studying
  }), shallow)

  return (
    <div className = 'full'>

      <Canvas 
        invalidateFrameloop = {false}
        onPointerMissed = {()=> {
          select(null)
          study(null)
        }}
        props = {{antialias: false}}
      >
        <PhysicsProvider>
            <CameraProvider>
            <Enclosure
              active = {!selected} 
            /> 
            <Projects>
              <Scorecard
                name = 'scorecard'
                key = 'scorecard'
                position = {[-1,35,0]}
                rotation = {[0,10,0]}
              />
            
              <Seseme 
                name = 'seseme'
                key = 'seseme'
                position = {[-1.5,18,0]} 
                rotation = {[0,35,0]} 
              /> 
            
              <Eclipse 
                name = 'eclipse'
                key = 'eclipse'
                position = {[2,5,0]} 
                rotation = {[0,0,0]}
              /> 
            
            </Projects>

            <group>
              <LineTo />
              <DumbCube /> 
            </group>

            </CameraProvider>
            
        </PhysicsProvider>

      </Canvas>
      {selected && !studying && 
        <InfoBlurb>
          {!studying && selected === 'scorecard' && <SCBlurb />}
        </InfoBlurb>
      }
      {studying &&
      <InfoPage>
        {studying === 'scorecard' && <SCPage />}
      </InfoPage>
      }

    </div>
  );
}


const InfoBlurb = styled.div`
  position: absolute;
  border: 1px solid red;
  width: 50%;
  height: 500px;
  top: 0; bottom: 0; margin: auto 0;
  right: 0;
`

const InfoPage = styled.div`
// display: none;
  border-left: 2px solid black;
  padding-left: 30px;
  // background: white;
  width: 66%; 
  height: 100%; 
  position: absolute;
  top: 0; right: 0;
`


export default App;
