import React, {useState, useEffect, useContext, useRef, Suspense} from 'react';
import './App.css';
import { Canvas, useFrame, useRender, useLoader } from 'react-three-fiber'
import styled from 'styled-components'

import * as CANNON from 'cannon'


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {PhysicsProvider, usePhysics} from './components/core/Physics'
import {Body} from './components/core/Body'
import {Enclosure} from './components/core/Wall'

import Seseme from './components/projects/seseme'
import Eclipse from './components/projects/Eclipse'
import Scorecard from './components/projects/Scorecard'



import {Debug, Range, TinkerGroup} from './components/Debug'
import Camera, {AdjustCamera} from './components/core/Camera'

import Projects from './components/core/Projects'
 
import {toRads, toDegs} from './utils/3d'


export const WorldFunctions = React.createContext({
  //insert functions that every child of the world should have? 
})

function App() {

  const isInitialMount = useRef(true)

  const [projectCamera, setProjectCamera] = useState(null)
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
        {/* <fog attach="fog" args={['#ffffff', 55, 85]} /> 
        <directionalLight args = {[0xffffff, 0.4]} castShadow />
        */}
        <PhysicsProvider>
          
            <WorldFunctions.Provider value = {{
              select: select,
              selected: selected,
              setProjectCamera: setProjectCamera,
              camStatus: camStatus,
              setCamStatus: setCamStatus,
              abyss: abyss,
              admitToAbyss: admitToAbyss,
            }}>
            <Camera 
              projectCamera = {projectCamera}
              useThis = {useCamera === 'default'}
            />
            {/* Debug cameras follow */}
            <AdjustCamera
              projectCamera = {projectCamera}
              useThis = {useCamera === 'adjust'}
              offsets = {adjustOffset}
            />

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
            </WorldFunctions.Provider>
            

        </PhysicsProvider>

      </Canvas>
    {/*
      <Debug>
        {selected}
        <TinkerGroup name = 'cam' obj = {cam} func = {setCam} open />
        
      </Debug>
      */}
      <DebugDialog>
        <input
          type = 'radio' id = 'default' 
          value = 'default' name = 'cameraChoice' 
          checked = {useCamera === 'default'}
          onChange = {e=>chooseCamera(e.target.value)}
        /> 
        default
        <input
          type = 'radio' id = 'adjust' 
          value = 'adjust' name = 'cameraChoice' 
          checked = {useCamera === 'adjust'}
          onChange = {e=>chooseCamera(e.target.value)}
        /> 
        adjust
        <input
          type = 'radio' id = 'orbital' 
          value = 'orbital' name = 'cameraChoice' 
          checked = {useCamera === 'orbital'}
          onChange = {e=>chooseCamera(e.target.value)}
        /> 
        orbital
        <input
          type = 'radio' id = 'preset' 
          value = 'preset' name = 'cameraChoice' 
          checked = {useCamera === 'preset'}
          onChange = {e=>chooseCamera(e.target.value)}
        /> 
        preset
        {projectCamera && <div>
            {projectCamera.name}
            {projectCamera.position.join(',')}
        </div>}

        {useCamera === 'adjust' && projectCamera && 
          <div>
            <input
              autocomplete = {'fuckyou'}
              type = 'number' 
              value = {Number(projectCamera.position[0]) + Number(adjustOffset.position[0])} 
              onChange = {e => changeAdjOffset({...adjustOffset, position: [e.target.value - projectCamera.position[0] , adjustOffset.position[1], adjustOffset.position[2]]})}
            />
            <input
              autocomplete = {'fuckyou'}
              type = 'number' 
              value = {Number(projectCamera.position[1]) + Number(adjustOffset.position[1])} 
              onChange = {e => changeAdjOffset({...adjustOffset, position: [adjustOffset.position[0], e.target.value - projectCamera.position[1] , adjustOffset.position[2]]})}
            />
            <input
              autocomplete = {'fuckyou'}
              type = 'number' 
              value = {Number(projectCamera.position[2]) + Number(adjustOffset.position[2])} 
              onChange = {e => changeAdjOffset({...adjustOffset, position: [adjustOffset.position[0], adjustOffset.position[1], e.target.value - projectCamera.position[2]]})}
            />

            <input
              autocomplete = {'fuckyou'}
              type = 'number' 
              value = {toDegs(Number(projectCamera.rotation[0])) + toDegs(Number(adjustOffset.rotation[0]))} 
              onChange = {e => changeAdjOffset({...adjustOffset, rotation: [toRads(e.target.value) - projectCamera.rotation[0] , adjustOffset.rotation[1], adjustOffset.rotation[2]]})}
            />
            <input
              autocomplete = {'fuckyou'}
              type = 'number' 
              value = {toDegs(Number(projectCamera.rotation[1])) + toDegs(Number(adjustOffset.rotation[1]))} 
              onChange = {e => changeAdjOffset({...adjustOffset, rotation: [adjustOffset.rotation[0], toRads(e.target.value) - projectCamera.rotation[1] , adjustOffset.rotation[2]]})}
            />
            <input
              autocomplete = {'fuckyou'}
              type = 'number' 
              value = {toDegs(Number(projectCamera.rotation[2])) + toDegs(Number(adjustOffset.rotation[2]))} 
              onChange = {e => changeAdjOffset({...adjustOffset, rotation: [adjustOffset.rotation[0], adjustOffset.rotation[1], toRads(e.target.value) - projectCamera.rotation[2]]})}
            />
          </div>
        }

      </DebugDialog>
    </div>
  );
}



export default App;

const DebugDialog = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 320px;
  height: 600px;
  border: 1px solid black;
`