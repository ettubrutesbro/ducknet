import React, {Suspense, useEffect, useState} from 'react'
import {useLoader} from 'react-three-fiber'
import * as THREE from 'three'
import {a, useSprings} from 'react-spring/three'
import useInterval from 'use-interval'
import chroma from 'chroma-js'

import {Body} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../utils/3d'



function Scorecard({
    onClick = () => console.log('clicked eclipse'), 
    selected = false,
    onSelect,
    ...props
}){
    const ca = useLoader(GLTFLoader, '/scorecard/fin/state-gp2.gltf', loader => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco-gltf/')
      loader.setDRACOLoader(dracoLoader)
    })

    // const ca = useLoader(OBJLoader, '/scorecard/scobj.obj')

    const [projectCamera, changeView] = useState({
        position: [4.75, 8, 12],
        rotation: [toRads(-8), toRads(0), toRads(0)],
        fov: 70,
    })

    const alpha = useLoader(THREE.TextureLoader, '/scorecard/fin/scorecarduv.png' )
    console.log(alpha)
    alpha.flipY = false



    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            forceTo({
                position: [-1.5,5,0],
                rotation: [0,55,0]
            })
            onSelect(projectCamera)
        }
        else{
            console.log('unpicked sc')
            forceTo(null)
            onSelect(null)
        }
    }, [selected])



    // useInterval(()=>{
    //     changeVis(vis < 5? vis+1 : 0)
    // }, 3500)
    console.log(ca)

    return( <Body 
        name = 'scorecard'
        shapes = {['box', 'box']}
        shapeParams = {[
            // {size: [2.25,6,1], offset: [0,0,0], rotation: [0, 0, toRads(38)]}
            {size: [1.7,4,1.5], offset: [0.7,-1,0], rotation: [0, 0, toRads(44)]},
            {size: [1.7,1.5,1.5], offset: [-1,1.8,0]}
        ]}
        forced = {forced}
        visible = {false}
        {...props}
    >
        
        <group 
            scale = {[.1,.1,.1]} //obj 
            // scale = {[.015,.05,.015]} // gltfprescale
            // scale = {[.1,.1,.1]} 
            position = {[0.15,0,-0.4]} 
            // rotation = {[toRads(90),0,0]} 
            onClick = {onClick}
        >
           {
            // ca.children.map((child) => {
            ca.__$.map((child) => {
                console.log(child.name)
                return(
                    <mesh>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshLambertMaterial

                            attach ='material'
                            map = {alpha}
                            // visible = {child.name === 'restofca'}
                            // transparent
                        />
                    </mesh>
                )           
            })}

 
        </group>
    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function ScorecardWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Scorecard {...props} /></Suspense>
}


function Material({...props}){
  return(
    <meshBasicMaterial 
      attach = 'material' 
      // color = {0xffffff}
      // color = {0x88c696}
      // emissive = {0x8111c}
      {...props}
    />
  )
}