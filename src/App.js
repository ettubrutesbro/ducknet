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

// import Seseme from './components/projects/seseme'
// import Eclipse, {EclipseBlurb} from './components/projects/Eclipse'
// import Scorecard from './components/projects/Scorecard/'

import allprojects from './components/projects/'


import {CameraProvider} from './components/core/Camera'

import Projects from './components/core/Projects'
import Blurb from './components/core/Blurb'
import Page from './components/core/Page'

import {toRads, toDegs} from './utils/3d'

require("typeface-spectral")
require("typeface-archivo")

const {Scorecard, MockProject} = allprojects



export const [userStore] = create(set => ({
  selected: null, select: v => set({selected: v}),
  studying: null, study: v => set({studying: v}),

  lineA: null, setA: v => set({lineA: v}),
  // lineA: null, setA: v => console.log(v),
  lineB: {x: 100, y: 100}, setB: v => set({lineB: v}),

  //for signaling when animation can fire for page contents
  pageReady: false, setPageReady: v => set({pageReady: v})
})) 


function App() {

  const {select, selected, study, studying, pageReady} = userStore(store => ({
    select: store.select,
    selected: store.selected,
    study: store.study,
    studying: store.studying,
    pageReady: store.pageReady
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

            <spotLight color = {0xeaddb9} intensity = {1.2} position = {[-7,25,-4]}/>
            <pointLight color = {0xffffff} intensity = {.35} position = {[-40,8,3]}/>
            <ambientLight color = { 0x232330 } />

            <Enclosure
              active = {!selected} 
            /> 
            <Projects>
              <Scorecard.object
                name = 'scorecard'
                key = 'scorecard'
                position = {[-1,35,0]}
                rotation = {[0,10,0]}
              />
              <MockProject.object
                name = 'mock'
                key = 'mock'
              />
              {/*
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
              */}
            </Projects>



            </CameraProvider>
            
        </PhysicsProvider>

      </Canvas>

      {
        <Blurb 
          mode = {
            studying !== null? 'expand' 
            : selected !== null? 'visible' 
            : 'hidden'
            
          }
          visible = {selected !== null}
        >
          {selected === 'scorecard' && Scorecard.blurb[0]}
          {selected === 'scorecard' && Scorecard.blurb[1]}
          {selected === 'scorecard' && Scorecard.blurb[2]}

        </Blurb>
      }


      {
         <Scorecard.page /> 
      }

    </div>
  );
}

export default App;
