
//when used in a project model, linespot reports its world-to-screen position every frame
//so that a 2d line tool atop the DOM can be updated

import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {useFrame} from 'react-three-fiber'
import {a, useSprings} from 'react-spring/three'

import {cameraContext} from '../components/core/Camera'

export function LineSpot({position = [0,0,0]}){

    const ref = useRef()

    const [vertex, setvertex] = useSprings(2, i => ({
        v: [0,i*100,0]
    }))

    useEffect(()=>{
        let v3 = new THREE.Vector3()
        // console.log(ref.current.getWorldPosition(v3))

    })



    return <group ref = {ref} position = {position} >
        <mesh>
            <boxBufferGeometry attach = 'geometry' args = {[4,4,4]} />
            <meshNormalMaterial attach = 'material' />
        </mesh>

    </group>
}



