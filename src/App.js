import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import * as CANNON from 'cannon'

import {PhysicsProvider, usePhysics} from './components/core/Physics'
import {Body} from './components/core/Body'
import {Enclosure} from './components/core/Wall'

import Seseme from './components/projects/seseme'
import Eclipse from './components/projects/Eclipse'
import Scorecard from './components/projects/Scorecard/'

import {CameraProvider} from './components/core/Camera'

import Projects from './components/core/Projects'
 
import {toRads, toDegs} from './utils/3d'


export const WorldFunctions = React.createContext({
  //insert functions that every child of the world should have? 
})

function App() {

  const isInitialMount = useRef(true)

  const [selected, select] = useState(null)
  const [abyss, admitToAbyss] = useState([]) //for removing projects as they fall out of view 
  const [camStatus, setCamStatus] = useState(null)

  useEffect(()=>{
    if(isInitialMount.current){
      isInitialMount.current = false
    }
    else if(!selected){
      console.log('clearing abyss')
      admitToAbyss([])
    }
  }, [selected])

  useEffect(()=>{
    console.log('cam status changed: ', camStatus)
  }, [camStatus])

  const [useCamera, chooseCamera] = useState('default')
  const [adjustOffset, changeAdjOffset] = useState({
    position: [0,0,0], rotation: [0,0,0], fov: 0
  })

  return (
    <div className = 'full'>
      <Canvas 
        invalidateFrameloop = {false}
        onPointerMissed = {()=> select(null)}
        props = {{antialias: false}}
      >
        <PhysicsProvider>
            <WorldFunctions.Provider value = {{
              select: select,
              selected: selected,
              // camStatus: camStatus,
              // setCamStatus: setCamStatus,
              abyss: abyss,
              admitToAbyss: admitToAbyss,
            }}>
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
            </CameraProvider>
            </WorldFunctions.Provider>
            

        </PhysicsProvider>

      </Canvas>
   
    </div>
  );
}



export default App;
