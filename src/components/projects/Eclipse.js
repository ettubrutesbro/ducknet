import React, {Suspense, useEffect, useState} from 'react'
import {useLoader} from 'react-three-fiber'
import {Body} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../utils/3d'

export function Eclipse({
    onClick = () => console.log('clicked eclipse'), 
    selected = false,
    ...props
}){
    const dragon = useLoader(GLTFLoader, '/eclipse.gltf', loader => {
    const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })

    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected === 'eclipse'){
            forceTo({
                position: [0,0,0],
                rotation: [0,0,0]
            })
        }
        else{
            console.log('unpicked eclipse')
            forceTo(null)
        }
    }, [selected])


    return( <Body 
        shapes = {['cylinder', 'sphere']}
        //for performance savings, the sphere could be replaced with a tapered cylinder?
        shapeParams = {[{size: [1.1,1.8,2.6,8], offset: [0,.2,0]}, {size: [1.5], offset: [0,-.2,0]}]}
        forced = {forced}
        {...props}
    >
        
        <mesh scale = {[.2,.2,.2]} position = {[0,0.7,0]} rotation = {[0,toRads(90),0]} onClick = {onClick}>
            <bufferGeometry attach = 'geometry' {...dragon.__$[1].geometry} />
            <meshNormalMaterial attach = "material" />
        </mesh>
    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function EclipseWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Eclipse {...props} /></Suspense>
}