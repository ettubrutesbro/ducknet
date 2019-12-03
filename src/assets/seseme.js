import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
  
export default function Model(props) {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, '/sese.gltf', loader => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })

  return (
    <group ref={group} {...props}>
      <scene >
        <mesh name="Plane002" scale = {[.1,.1,.1]}>
          <bufferGeometry attach="geometry" {...gltf.__$[1].geometry} />
          <meshNormalMaterial attach="material" />
        </mesh>
      </scene>
    </group>
  )
}