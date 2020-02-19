
//when used in a project model, linespot reports its world-to-screen position every frame
//so that a 2d line tool atop the DOM can be updated

import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import {useFrame} from 'react-three-fiber'
import {a, useSprings, useSpring} from 'react-spring/three'

import {cameraContext} from '../components/core/Camera'

export function LineSpot({position = [0,0,0]}){

    const ref = useRef()

    const [vertex, setvertex] = useSprings(2, i => ({
        v: [0,i*100,0]
    }))

    useEffect(()=>{
        let v3 = new THREE.Vector3()
        console.log(ref.current.getWorldPosition(v3))

    })

const { factor } = useSpring({
    config: { mass: 5, tension: 500, friction: 340 },
    from: { factor: 0 },
    to: async next => {
      while (true) {
        await next({ factor: 1 })
        await next({ factor: 0 })
      }
    }
  })


    const [foo, bar] = useSpring(()=>({position: [0,0,0]}))


    return <group ref = {ref} position = {position} >
        <mesh>
            <boxBufferGeometry attach = 'geometry' args = {[1,1,1]} />
            <meshNormalMaterial attach = 'material' />
        </mesh>

        <line>
            <a.geometry 
                attach = 'geometry'
                // vertices = {[0,100].map((v,i)=> new THREE.Vector3(0,i*100,0))} 
                vertices = {factor.interpolate(f => [0,100].map((v,i)=> new THREE.Vector3(i*2,i*5,0).multiplyScalar(f))) } 
                onUpdate = {self => self.verticesNeedUpdate = true}
            />
            <lineBasicMaterial 
                attach = 'material' 
                color = {0xff0000} 
                linewidth = {20}
            />
        </line>
    </group>
}



