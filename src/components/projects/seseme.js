import * as THREE from 'three'
import React, { useEffect, useRef, Suspense } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {Body, SimpleBody, LoadingProject} from '../core/Body'
  
function Seseme(props) {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, '/sese.gltf', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  return (
    <SimpleBody size = {[2.4, 4, 2.4]} {...props}>
      <mesh name="Plane002" scale = {[.1,.1,.1]} position = {[0.3,1.6,0]}>
        <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
        <meshNormalMaterial attach="material" />
      </mesh>
    </SimpleBody>
  )
}

// this might get cumbersome but it's what i have rn
export default function SesemeWrapped(props){
  return <Suspense fallback = {<LoadingProject name = 'seseme' />}><Seseme {...props} /></Suspense>
}