import React, {Suspense, useEffect, useState} from 'react'
import * as THREE from 'three'
import {useLoader} from 'react-three-fiber'
import {Body} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../utils/3d'

export function Eclipse({
    onClick = () => console.log('clicked eclipse'), 
    selected = false,
    onSelect,
    showBody = false,
    falling,
    ...props
}){
    const dragon = useLoader(GLTFLoader, '/eclipse/eclipse.gltf', loader => {
    const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })
     const texture = useLoader(THREE.TextureLoader, '/eclipse/mc35Blur03.jpg' )
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
            // console.log('unpicked eclipse')
            forceTo(null)
            onSelect(null)
        }
    }, [selected])


    return( <Body 
        visible = {showBody}
        name = 'eclipse'
        falling = {falling}
        shapes = {['cylinder', 'sphere']}
        //for performance savings, the sphere could be replaced with a tapered cylinder?
        shapeParams = {[{size: [1.1,1.8,2.6,8], offset: [0,.2,0]}, {size: [1.5], offset: [0,-.2,0]}]}
        forced = {forced}
        {...props}
    >
        
        <mesh scale = {[.2,.2,.2]} position = {[0,0.7,0]} rotation = {[0,toRads(90),0]} onClick = {onClick}>
            <bufferGeometry attach = 'geometry' {...dragon.__$[1].geometry} />
            
            <meshMatcapMaterial attach = 'material' matcap = {texture} />
        </mesh>
    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function EclipseWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Eclipse {...props} /></Suspense>
}