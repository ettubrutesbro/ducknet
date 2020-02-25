import * as THREE from 'three'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {Body} from '../core/Body'
import {toRads} from '../../utils/3d'
  
export function Seseme({
  onClick = () => console.log('clicked seseme'), 
  selected, 
  onSelect, //enables project component to send camera changes up
  debug = true,
  ...props
}) {

  const ref = useRef()
  const [projectCamera, changeView] = useState({
    position: [32, 21, 35],
    rotation: [toRads(-26), toRads(35), toRads(14)],
    fov: 35,
  })
  const [forced, forceTo] = useState(null)


  const pedestal = useLoader(GLTFLoader, '/seseme/pedestal.gltf', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  const pillar = useLoader(GLTFLoader, '/seseme/pillar.gltf', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  // const group = useRef()

  const [plrHts, modPlrHt] = useState({
    a: 9.5, b: -1.5, c: -9.5, d:-15
                                                  })


  useEffect(()=>{
      // console.log(ref.current.position)
      if(selected){
          console.log('picked seseme')
          forceTo({
              position: [0,5,0],
              rotation: [0,45,0]
          })
          onSelect(projectCamera)
      }
      else{
          // console.log('unpicked seseme')
          forceTo(null)
          onSelect(null)
      }
  }, [selected])

  


  return (
    <Body 
      name = 'seseme'
      shapes = {['box','box']}
      shapeParams = {[
        {size: [2.4, 3.6, 2.4], offset: [0,0,0]},
        {size: [1.7, 3.1, 1.7], offset: [0,3,0]}
      ]} 
      forced = {forced}
      {...props}
      visible  = {false}
    >
      <group name = 'seseme' position = {[0.3,1.8,0.2]} scale = {[.1,.1,.1]}>
        <group name = 'main' onClick = {onClick}>
        <mesh name="pedestal">
          <bufferGeometry attach="geometry" {...pedestal.__$[1].geometry} />
          <Material attach = 'material' />
        </mesh>
        <mesh name = "pillar" position = {[1,plrHts.a,2.1]}>
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <Material attach = 'material' />
        </mesh>
       
        <mesh name = "pillar2" position = {[1,plrHts.b,-6.25]} rotation = {[0,toRads(90),0]} >
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <Material attach = 'material' />
        </mesh>
        
        <mesh name = "pillar3" position = {[-7.1,plrHts.c,-6.25]} rotation = {[0,toRads(180),0]} >
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <Material attach = 'material' />
        </mesh>
        
        <mesh name = "pillar4" position = {[-7.1,plrHts.d,2.1]} rotation = {[0,toRads(-90),0]} >
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <Material attach = 'material' />
        </mesh>
        </group>
      </group>
    </Body>
  )
}


function Material(){
  return(
    <meshPhongMaterial 
      attach = 'material' 
      color = {0x80848e}
      specular = {0x9a6a40}
      emissive = {0x101011}
      shininess = {17}
    />
  )
}


// this might get cumbersome but it's what i have rn
export default function SesemeWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Seseme {...props} /></Suspense>
}