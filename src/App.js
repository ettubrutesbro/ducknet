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


export const WorldFunctions = React.createContext({
  //insert functions that every child of the world should have? 
})

function App() {

  const isInitialMount = useRef(true)

  const [projectCamera, setProjectCamera] = useState(null)
  const [selected, select] = useState(null)
  const [abyss, admitToAbyss] = useState([])

  useEffect(()=>{
    if(isInitialMount.current){
      isInitialMount.current = false
    }
    else if(!selected){
      console.log('clearing abyss')
      admitToAbyss([])
    }
  }, [selected])

  return (
    <animated.div className = 'full'>
      <Canvas 
        invalidateFrameloop = {false}
        onPointerMissed = {()=> select(null)}
        props = {{antialias: false}}
      >
        {/* <fog attach="fog" args={['#ffffff', 55, 85]} /> */}
        <directionalLight args = {[0xffffff, 0.4]} castShadow />
        <PhysicsProvider>
          <Camera 
            projectCamera = {projectCamera}
          />
          <Enclosure
            active = {!selected} 
          /> 
            <WorldFunctions.Provider value = {{
              selected: selected,
              setProjectCamera: setProjectCamera,
              abyss: abyss,
              admitToAbyss: admitToAbyss
            }}>
            {!abyss.includes('scorecard') && 
              <Scorecard
                position = {[-1,35,0]}
                rotation = {[0,10,0]}

                onClick = {() => select('scorecard')}
                selected = {selected === 'scorecard'}
                onSelect = {setProjectCamera}
                falling = {selected && selected !== 'scorecard'}

                // showBody
                // onExitView = {admitToAbyss}
              />
            }
            {/*!abyss.includes('seseme') &&
              <Seseme 
                position = {[-1.5,18,0]} 
                rotation = {[0,35,0]} 
                //onClick, selected and onSelect should be distributed
                //automatically via some kind of React.children map..? or <Project />

                onClick = {()=>select('seseme')}
                selected = {selected==='seseme'}
                onSelect = {setProjectCamera}
                falling = {selected && selected !== 'seseme'}
                showBody
                // onExitView = {admitToAbyss}
              /> 
            */}
            {!abyss.includes('eclipse') &&
              <Eclipse 
                position = {[2,5,0]} 
                rotation = {[0,0,0]} 
                onClick = {()=>select('eclipse')}

                selected = {selected==='eclipse'}
                onSelect = {setProjectCamera}
                falling = {selected && selected !== 'eclipse'}
                // showBody
                // onExitView = {admitToAbyss}
              /> 
            }
            </WorldFunctions.Provider>
            

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
