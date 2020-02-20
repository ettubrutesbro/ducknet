import React, {useRef, useEffect} from 'react'
import * as THREE from 'three'
import {extend} from 'react-three-fiber'
import * as meshline from 'threejs-meshline'



import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry'
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial'
import {Line2} from 'three/examples/jsm/lines/Line2'
import {GeometryUtils} from 'three/examples/jsm/utils/GeometryUtils'

extend(meshline)


export function TestFatLine({testMutation = false}){

    const insertLineRef = useRef()

    useEffect(()=>{
        // insertLineRef.current
        console.log('creating fat line')


        let geometry = new LineGeometry()

        geometry.setPositions([0,0,0, 0,10,0])
    
        let mtl = new LineMaterial({
            color: 0xff0000,
            linewidth: 5
        })

        mtl.resolution.set(window.innerWidth, window.innerHeight)

        let line = new Line2( geometry, mtl )
        line.computeLineDistances()
        line.scale.set(0.5,0.5,0.5)

        insertLineRef.current.add(line)
    })


    useEffect(()=>{
        console.log(insertLineRef.current.children[0])
    }, [testMutation])



    return <group ref = {insertLineRef} />
}


export function TestMeshLine({}){

    return <mesh>
        <meshLine attach = 'geometry' vertices = {[
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(10,10,-100),
        ]} />
        <meshLineMaterial attach = 'material'
            color = {0xff0f00}
            lineWidth = {0.01}
            sizeAttenuation = {0}
            near = {0}
            far = {100}
        />
    </mesh>

}