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

    const offsetFromPhys = [0.15,0,-0.4]

    const ca = useLoader(GLTFLoader, '/scorecard/resplit.gltf', loader => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco-gltf/')
      loader.setDRACOLoader(dracoLoader)
    })

    const [projectCamera, changeView] = useState({
        position: [4, 7.5, 8],
        rotation: [toRads(-8), toRads(0), toRads(0)],
        fov: 85,
    })

    const texture = useLoader(THREE.TextureLoader, '/scorecard/peelshade.png' )
    texture.flipY = false

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


     const loadedNameOrder = ca.__$.map(c => c.name)
     console.log(loadedNameOrder)

    const [springs, setSprings] = useSprings(13, i => ({
        scale: [1,1,1],
        color: '#dedede',
        config: { mass: 1, tension: 120, friction: 32 }
    }))

    const countyVisStates = {
        dental: { 
            pseudonorth: {z: 0.8, c: '#81D2B0'},
            modoc: {z: 0.75},
            lassen: {z: .925, c: '#54b88e'}, 
            siskiyou: {c: '#d6f0ee', z: .675},
            pseudocentral: {z: 0.625, c: '#D6F0EE'},
            pseudocoast: {z: .84, c: '#54b88e'},
            sanbernie: {z: 0.5, c: '#D6F0EE'},
            sandiego: {z: 0.55, c: '#D6F0EE'},
            sfsm: {z: .975, c: '#3CA77A'},
            mendo: {z: 1.05, c: '#3CA77A'},
            inyo: {z: .75},
            baseZ: 0.7,
            baseColor: '#97D7C8' 
        },
        meals: { 
            modoc: {c: '#2F8F67', z: 1.15},
            mendo: {z: 1.02},
            sanbernie: {z: 1.17},
            pseudosouth: {z: 1.15},
            pseudonorth: {c: '#7FCCAC'},
            pseudocentral: {c: '#257554', z: 1.29},
            pseudocoast: {c: '#2F8F67', z: 1.2},
            sandiego: {z: 1, c: '#6FC9A3'},
            siskiyou: {z: 1.05},
            inyo: {z: 0.88, c: '#97D7C8'},
            lassen: {z: 0.95, c: '#97D7C8'},
            baseZ: 1.1,
            baseColor: '#54b88e' 
        }
    }

    useInterval(()=>{
        changeVis(vis < 3? vis+1 : 0)
    }, 5500)

    useEffect(()=>{
        if(d[vis]){
            const currentVis = d[vis]
            setSprings(i => {
                // console.log(i, ca.__$[i].name)
                const cty = ca.__$[i].name
                    const cv = countyVisStates[currentVis][cty]
                    return {
                        scale: [1,1, cv? cv.z || countyVisStates[currentVis].baseZ : countyVisStates[currentVis].baseZ], 
                        color: cv? cv.c || countyVisStates[currentVis].baseColor : countyVisStates[currentVis].baseColor,
                        delay: 50 * i
                    }
                
            })
        }
    }, [vis])

    return( <Body 
        name = 'scorecard'
        shapes = {['box', 'box']}
        shapeParams = {[
            // {size: [2.25,6,1], offset: [0,0,0], rotation: [0, 0, toRads(38)]}
            {size: [1.7,3.75,1.7], offset: [0.7,-.9,0], rotation: [0, 0, toRads(44)]},
            {size: [1.7,1.5,1.7], offset: [-1,1.8,0]}
        ]}
        forced = {forced}
        visible = {showBody}
        falling = {falling}
        {...props}
    >
        
        <group 
            scale = {[.075,.075,.075]} 
            position = {offsetFromPhys} 
            // rotation = {[toRads(90),0,0]} 
            onClick = {onClick}
            // visible = {false}
        >
            
           {springs.map(({scale,color}, i)=>{
                const child = ca.__$[i]
                return(
                    <a.mesh 
                        key = {child.name}
                        name = {child.name}
                        scale = {scale}
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial
                            color = {color}
                            attach ='material'
                            map = {texture}
                            // alphaMap = {alpha}
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
