import React, {useRef, useEffect} from 'react'
import * as THREE from 'three'

import {toRads} from './3d'

export function DataTextureTest(){
    
    const mtlref = useRef()

    useEffect(()=>{
        if(mtlref.current){
            const topLeft = new THREE.Color(0xf5f5ec)
            const topRight = new THREE.Color(0xffffff)
            const bottomRight = new THREE.Color(0xf5ecec)
            const bottomLeft = new THREE.Color(0xecedf5)
            // const topLeft = new THREE.Color(0x00ffff)
            // const topRight = new THREE.Color(0xffffff)
            // const bottomRight = new THREE.Color(0xff00ff)
            // const bottomLeft = new THREE.Color(0x0000ff)

            const data = new Uint8Array([
                Math.round(bottomLeft.r * 255), Math.round(bottomLeft.g * 255), Math.round(bottomLeft.b * 255),
                Math.round(bottomRight.r * 255), Math.round(bottomRight.g * 255), Math.round(bottomRight.b * 255),
                Math.round(topLeft.r * 255), Math.round(topLeft.g * 255), Math.round(topLeft.b * 255),
                Math.round(topRight.r * 255), Math.round(topRight.g * 255), Math.round(topRight.b * 255)
            ])

            const backgroundTexture = new THREE.DataTexture(data, 2, 2, THREE.RGBFormat)
            backgroundTexture.magFilter = THREE.LinearFilter
            backgroundTexture.needsUpdate = true

            mtlref.current.map = backgroundTexture
        }
    }, [mtlref])

    return <mesh>
                <planeBufferGeometry attach = 'geometry' args = {[20,20]} rotation = {[toRads(15),toRads(10),toRads(5)]}/>

                <meshBasicMaterial ref = {mtlref} attach = 'material' needsUpdate />
            </mesh>

}