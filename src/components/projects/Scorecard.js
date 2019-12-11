import React, {Suspense, useEffect, useState} from 'react'
import {useLoader} from 'react-three-fiber'
import {a, useSprings} from 'react-spring/three'
import useInterval from 'use-interval'
import chroma from 'chroma-js'

import {Body} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../utils/3d'



function Scorecard({
    onClick = () => console.log('clicked eclipse'), 
    selected = false,
    onSelect,
    ...props
}){
    const ca = useLoader(GLTFLoader, '/scorecard-ss.gltf', loader => {
    const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })
    const [projectCamera, changeView] = useState({
        position: [0, 6, 10],
        rotation: [toRads(-18), toRads(0), toRads(0)],
        fov: 75,
    })
    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            forceTo({
                position: [0,5,0],
                rotation: [0,35,0]
            })
            onSelect(projectCamera)
        }
        else{
            console.log('unpicked sc')
            forceTo(null)
            onSelect(null)
        }
    }, [selected])

    const d = [null, 'dental', null, 'meals', null, 'madeupshit']
    const countyColors = {
        dental: 'hsla(286, 30%, 84%, 1)',
        meals: '#8bd2bf', 
        madeupshit: '#74a9cf',
        yallsuck: 'hsla(286, 30%, 84%, 1)', 
    }
    // const sideColors = {
    //     dental: chroma(countyColors.dental).darken().hex(),
    //     meals: chroma(countyColors.meals).darken().hex(),
    //     madeupshit: chroma(countyColors.madeupshit).darken().hex(),
    // }
    const counties = {
        dental: {modoc: 7, mendocino: 7, siskiyou: 4, inyo: -5.5, lassen: -6},
        meals: { sfsm: 5, sandiego: 4, lassen: -6, sanbernie: -3},
        madeupshit: { sanbernie: 3, lassen: -2, modoc: -5, siskiyou: -8, mendocino: 3},
        yallsuck: {sfsm: -2, sandiego: -2, inyo: -2, modoc: -4, lassen: -2},
    }
    const [vis, changeVis] = useState(0)

    const [springs, set] = useSprings(9, i => ({
        position: [0,0,0], 
        color: '#ff0000', sideColor: '#de0000', indentColor: '#de0000', outdentColor: '#de0000',
        config: { mass: 20, tension: 500, friction: 200 }
    }))

    useInterval(()=>{
        changeVis(vis < 5? vis+1 : 0)
    }, 3500)

    useEffect(()=>{
        set(i => {
            // console.log(i, ca.__$[i].name)
            const cty = ca.__$[i].name
            const baseColor = d[vis]? countyColors[d[vis]] : '#BBBBBB'
            return { 
                position: [0, d[vis]? counties[d[vis]][cty] || 0 : 0,0], 
                color: baseColor,
                sideColor: chroma(baseColor).darken(0.8).hex() ,
                indentColor: chroma(baseColor).brighten(0.4).hex() ,
                outdentColor: chroma(baseColor).saturate(0.4).darken(0.4).hex() ,
                // delay:  
            }
        })
    }, [vis])

    const sides = ca.__$.filter((child) => child.name.includes('_sides')).sort((a,b) => a.name > b.name? -1 : 1)
    const faces = ca.__$.filter((child) => !child.name.includes('_sides')&&child.name).sort((a,b) => a.name > b.name? -1 : 1)

    console.log(sides)
    console.log(faces)

    return( <Body 
        name = 'scorecard'
        shapes = {['box', 'box']}
        shapeParams = {[
            // {size: [2.25,6,1], offset: [0,0,0], rotation: [0, 0, toRads(38)]}
            {size: [1.7,4,1.4], offset: [0.7,-1,0], rotation: [0, 0, toRads(44)]},
            {size: [1.7,1.5,1.4], offset: [-1,1.8,0]}
        ]}
        forced = {forced}
        visible = {false}
        {...props}
    >
        
        <group scale = {[.012,.05,.012]} position = {[0.15,0,-0.4]} rotation = {[toRads(90),0,0]} onClick = {onClick}>
            {springs.map(({position, color, sideColor, indentColor, outdentColor}, i)=>{
                const child = faces[i]

                // console.log(chroma(color).darken().saturate(2).hex())
                // const {position, color} = springs
                let faceColor = color
                if(d[vis] && counties[d[vis]][child.name]){
                    if(counties[d[vis]][child.name] > 0) faceColor = outdentColor
                    else faceColor = indentColor
                } 
                return(
                    <a.group 
                        key = {child.name} 
                        name = {child.name}
                        position = {position}
                    >
                        <mesh>
                            <bufferGeometry attach = 'geometry' {...faces[i].geometry} />
                            <a.meshBasicMaterial transparent attach = 'material' color = {faceColor} /> 
                        </mesh>
                        <mesh>
                            <bufferGeometry attach = 'geometry' {...sides[i].geometry} />
                            <a.meshBasicMaterial transparent attach = 'material' color = {sideColor} /> 
                        </mesh>
                    </a.group>
                )
            })}
        </group>
    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function ScorecardWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Scorecard {...props} /></Suspense>
}