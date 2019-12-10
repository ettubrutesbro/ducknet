import * as THREE from 'three'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {Body, LoadingProject} from '../core/Body'
import {toRads} from '../../utils/3d'
  
export function Seseme({
  onClick = () => console.log('clicked seseme'), 
  selected, 
  ...props
}) {
  const group = useRef()
  const pedestal = useLoader(GLTFLoader, '/seseme.gltf', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  const pillar = useLoader(GLTFLoader, '/pillar-d.gltf', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  const [plrHts, modPlrHt] = useState({
    a: 9.5, b: -1.5, c: -9.5, d:-15
  })

  const [forced, forceTo] = useState(null)

  useEffect(()=>{
      if(selected === 'seseme'){
          forceTo({
              position: [0,5,0],
              rotation: [0,45,0]
          })
      }
      else{
          console.log('unpicked seseme')
          forceTo(null)
      }
  }, [selected])



  return (
    <Body 
      shapes = {['box','box']}
      shapeParams = {[
        {size: [2.4, 3.6, 2.4], offset: [0,0,0]},
        {size: [1.7, 3.1, 1.7], offset: [0,3,0]}
      ]} 
      forced = {forced}
      {...props}
    >
      <group name = 'seseme' position = {[0.3,1.8,0.2]} scale = {[.1,.1,.1]}>
        <group name = 'main' onClick = {onClick}>
        <mesh name="pedestal">
          <bufferGeometry attach="geometry" {...pedestal.__$[1].geometry} />
          <meshNormalMaterial attach="material" />
        </mesh>
        <mesh name = "pillar" position = {[1,plrHts.a,2.1]}>
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <meshNormalMaterial attach = 'material' />
        </mesh>
       
        <mesh name = "pillar2" position = {[1,plrHts.b,-6.25]} rotation = {[0,toRads(90),0]} >
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <meshNormalMaterial attach = 'material' />
        </mesh>
        
        <mesh name = "pillar3" position = {[-7.1,plrHts.c,-6.25]} rotation = {[0,toRads(180),0]} >
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <meshNormalMaterial attach = 'material' />
        </mesh>
        
        <mesh name = "pillar4" position = {[-7.1,plrHts.d,2.1]} rotation = {[0,toRads(-90),0]} >
          <bufferGeometry attach = 'geometry' {...pillar.__$[1].geometry} />
          <meshNormalMaterial attach = 'material' />
        </mesh>
        </group>
      </group>
    </Body>
  )
}

// this might get cumbersome but it's what i have rn
export default function SesemeWrapped(props){
  return <Suspense fallback = {<LoadingProject name = 'seseme' />}><Seseme {...props} /></Suspense>
}