import React, {Suspense} from 'react'
import {useLoader} from 'react-three-fiber'
import {SimpleBody} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export function Eclipse(props){
    const dragon = useLoader(GLTFLoader, '/eclipse.gltf', loader => {
    const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })

    return(
    <SimpleBody 
        shapes = {['cylinder', 'sphere']}
        //for performance savings, the sphere could be replaced with a tapered cylinder?
        shapeParams = {[{size: [1.1,1.8,2.6,8], offset: [0,.2,0]}, {size: [1.5], offset: [0,-.2,0]}]}
        {...props}
    >
        
        <mesh scale = {[.2,.2,.2]} position = {[0,0.7,0]}>
            <bufferGeometry attach = 'geometry' {...dragon.__$[1].geometry} />
            <meshNormalMaterial attach = "material" />
        </mesh>
    
    </SimpleBody>
    )
}

// this might get cumbersome but it's what i have rn
export default function EclipseWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Eclipse {...props} /></Suspense>
}