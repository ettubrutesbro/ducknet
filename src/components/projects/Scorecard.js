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
        position: [0,0,0],
        color: '#dedede',
        config: { mass: 20, tension: 500, friction: 200 }
    }))

    const countyPositions = {
        dental: { siskiyou: {z: 3, c: '#ff0000'}, },
        meals: { sandiego: {z:3, c: '#ff0000'} }
    }

    useInterval(()=>{
        changeVis(vis < 3? vis+1 : 0)
    }, 5500)

    useEffect(()=>{
        if(d[vis]){
            const dv = d[vis]
            setSprings(i => {
                // console.log(i, ca.__$[i].name)
                const cty = ca.__$[i].name
                    const cv = countyPositions[dv][cty]
                    return {
                        position: [0,0, cv? cv.z || 0 : 0], 
                        color: cv? cv.c || '#dedede' : '#dedede'
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
            position = {[0.15,0,-0.4]} 
            // rotation = {[toRads(90),0,0]} 
            onClick = {onClick}
            // visible = {false}
        >
            
           {springs.map(({position,color}, i)=>{
                const child = ca.__$[i]
                return(
                    <a.mesh 
                        key = {child.name}
                        name = {child.name}
                        position = {position}
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
