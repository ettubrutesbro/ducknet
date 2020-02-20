/*
    A line that connects from its own position to 0,0 on the screen
    we are just constantly setting the second vertex in the geometry to the target point (screen 0,0)

    0,0 on the screen has to be constantly calculated due to camera movement
    those coordinates must be passed into cameraContext for unprojection 

    then this component needs to normalize its position against world so the line can go to the proper world point
*/
import React, {useRef, useEffect, useContext} from 'react'
import * as THREE from 'three'
import {useFrame} from 'react-three-fiber'

import {cameraContext} from '../components/core/Camera'

import {DumbCube} from './DumbCube'

const target = {position: {x: 0, y: 0}}

export function LineTo(){

    const {cameraRef} = useContext(cameraContext)

    const lineRef = useRef()
    const lineGeo = useRef()

    useFrame(()=>{
        
        const lineWorldCoords = new THREE.Vector3()
        const targetWorldCoords = new THREE.Vector3()

        // targetWorldCoords.x = ((target.position.x) / window.innerWidth) * 2
        // targetWorldCoords.y = ((target.position.y) / window.innerHeight) * 2

        cameraRef.updateMatrixWorld()
        targetWorldCoords.unproject(cameraRef)

        const verts = lineGeo.current.vertices
        // verts[0].set(0,0,0)

        lineRef.current.getWorldPosition(lineWorldCoords)
        // console.log(lineWorldCoords)
        // console.log(targetWorldCoords)

        verts[1].set(targetWorldCoords.x, targetWorldCoords.y, targetWorldCoords.z)

        // pos.setXYZ(0, 0,0,0)
        // pos.setXYZ(1, targetWorldCoords.x, targetWorldCoords.y, targetWorldCoords.z)
        // pos.needsUpdate = true

    })

    return <line ref = {lineRef}>
        <geometry 
            attach = 'geometry'
            ref = {lineGeo} 
            vertices = {[0,100].map((v,i)=> new THREE.Vector3(0,i*100,0))}
            onUpdate = {self => self.verticesNeedUpdate = true}
        >
        </geometry>
        <lineBasicMaterial
            attach = 'material'
            color = {0xff0000}
        />
    </line>
}


export function OriginBox(){
    const {cameraRef} = useContext(cameraContext)
    const groupRef = useRef()

    useEffect(()=>{
        window.addEventListener('mousemove', (e)=>{
            // console.log(e.clientX)
            const mouse = {x: e.clientX, y: e.clientY}
            // const targetWorldCoords = new THREE.Vector3()

            // targetWorldCoords.x = ((mouse.x) / window.innerWidth) * 2 - 1
            // targetWorldCoords.y = ((mouse.y) / window.innerHeight) * 2 + 1

            // // cameraRef.updateMatrixWorld()
            // targetWorldCoords.unproject(cameraRef)

            // groupRef.current.position.set(...Object.values(targetWorldCoords))

        })
    })

    useFrame(()=>{
        
        // const lineWorldCoords = new THREE.Vector3()
        const targetWorldCoords = new THREE.Vector3()

        targetWorldCoords.x = ((target.position.x) / window.innerWidth) * 2 - 1
        targetWorldCoords.y = ((target.position.y) / window.innerHeight) * 2 + 1

        cameraRef.updateMatrixWorld()
        targetWorldCoords.unproject(cameraRef)

        // console.log(targetWorldCoords)

        // lineRef.current.getWorldPosition(lineWorldCoords)

        groupRef.current.position.set(...Object.values(targetWorldCoords))

        // verts[1].set(targetWorldCoords.x, targetWorldCoords.y, targetWorldCoords.z)

        // pos.setXYZ(0, 0,0,0)
        // pos.setXYZ(1, targetWorldCoords.x, targetWorldCoords.y, targetWorldCoords.z)
        // pos.needsUpdate = true

    })

    return <group ref = {groupRef}>  
        <DumbCube />
    </group>

}