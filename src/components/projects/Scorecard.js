import React, {Suspense, useEffect, useState} from 'react'
import {useLoader} from 'react-three-fiber'
import {Body} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../utils/3d'

function Scorecard({
    onClick = () => console.log('clicked eclipse'), 
    selected = false,
    onSelect,
    ...props
}){
    const ca = useLoader(GLTFLoader, '/scorecard-d.gltf', loader => {
    const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })
    const [projectCamera, changeView] = useState({
        position: [32, 21, 35],
        rotation: [toRads(-26), toRads(35), toRads(14)],
        fov: 35,
    })
    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            forceTo({
                position: [0,0,0],
                rotation: [0,0,0]
            })
            onSelect(projectCamera)
        }
        else{
            console.log('unpicked sc')
            forceTo(null)
            onSelect(null)
        }
    }, [selected])


    return( <Body 
        name = 'scorecard'
        shapes = {['box', 'box']}
        //for performance savings, the sphere could be replaced with a tapered cylinder?
        shapeParams = {[
            // {size: [2.25,6,1], offset: [0,0,0], rotation: [0, 0, toRads(38)]}
            {size: [1.7,4,1.4], offset: [0.7,-1,0], rotation: [0, 0, toRads(44)]},
            {size: [1.7,1.5,1.4], offset: [-1,1.8,0]}
        ]}
        forced = {forced}
        {...props}
    >
        
        <group scale = {[.012,.05,.012]} position = {[0.15,0,-0.4]} rotation = {[toRads(90),0,0]} onClick = {onClick}>
            {ca.__$.map((child, i)=>{
                return(
                    <mesh key = {child.name} name = {child.name}>
                        <bufferGeometry attach = 'geometry' {...ca.__$[i].geometry} />
                        <meshNormalMaterial attach = 'material' /> 
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