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
    showBody = false,
    falling,
    ...props
}){
    const ca = useLoader(GLTFLoader, '/scorecard/2020uvs.gltf', loader => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco-gltf/')
      loader.setDRACOLoader(dracoLoader)
    })

    const [projectCamera, changeView] = useState({
        position: [4, 7.5, 8],
        rotation: [toRads(-8), toRads(0), toRads(0)],
        fov: 85,
    })

    const texture = useLoader(THREE.TextureLoader, '/scorecard/scorecardtexture.jpg' )
    texture.flipY = false
    texture.anisotropy = 2048
    const alpha = useLoader(THREE.TextureLoader, '/scorecard/scorecardalpha.png' )
    alpha.flipY = false

    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            forceTo({
                position: [-1.25,6,0],
                rotation: [0,78,0]
            })
            onSelect(projectCamera)
        }
        else{
            console.log('unpicked sc')
            // debugger
            forceTo(null)
            onSelect(null)
        }
    }, [selected])

    // useInterval(()=>{
    //     changeVis(vis < 5? vis+1 : 0)
    // }, 3500)

    const d = [null, 'dental', null, 'meals', null, 'madeupshit']
    const [vis, changeVis] = useState(0)

    const animatingCounties = ['mendo','modoc','siskiyou','lassen','inyo','sanbernie','sandiego','sfsm','restofca']

    const [springs, setSprings] = useSprings(9, i => ({
        position: [0,0,0],
        config: { mass: 20, tension: 500, friction: 200 }
    }))

    useInterval(()=>{
        changeVis(vis < 1? vis+1 : 0)
    }, 5500)

    const countyPositions = {
        dental: {modoc: 2.5, mendo: 0, siskiyou: 1.5, inyo:0, lassen: 1, restofca: 0},
    }

    useEffect(()=>{
        setSprings(i => {
            // console.log(i, ca.__$[i].name)
            const cty = ca.__$[i].name
            return { 
                position: [0,0, d[vis]? countyPositions[d[vis]][cty] || 0 : 0], 
            }
        })
    }, [vis])

    return( <Body 
        name = 'scorecard'
        shapes = {['box', 'box']}
        shapeParams = {[
            // {size: [2.25,6,1], offset: [0,0,0], rotation: [0, 0, toRads(38)]}
            {size: [1.7,3.75,1.2], offset: [0.7,-.9,0], rotation: [0, 0, toRads(44)]},
            {size: [1.7,1.5,1.2], offset: [-1,1.8,0]}
        ]}
        forced = {forced}
        visible = {showBody}
        falling = {falling}
        {...props}
    >
        
        <group 
            scale = {[.075,.075,.075]} 
            position = {[0.15,0,-0.4]} 
            // rotation = {[toRads(90),0,0]} 
            onClick = {onClick}
            // visible = {false}
        >
           {springs.map(({position}, i)=>{
            // ca.__$.map((child) => {
                const child = ca.__$.filter(child => child.name.includes(animatingCounties[i]))[0]
                // const child = ca.__$.filter(child => child.name)[i]
                return(
                    <a.mesh 
                        key = {child.name}
                        name = {child.name}
                        position = {position}
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial
                            color = {0xdedede}
                            attach ='material'
                            map = {texture}
                            alphaMap = {alpha}
                            // visible = {child.name === 'restofca'}
                            transparent
                            opacity = {1}
                            needsUpdate
                        />


                    </a.mesh>
                )           
            })}

 
        </group>
    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function ScorecardWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Scorecard {...props} /></Suspense>
}
