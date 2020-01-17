import React, {Suspense, useEffect, useState, useContext, useRef} from 'react'
import * as THREE from 'three'


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../../utils/3d'

import {WorldFunctions} from '../../../App'

import {Body} from '../../core/Body'
import Model from './SCModel'

// const camSprings = [
//     {
//         name: 'sc start',
//         position: [1, 7.5, 8],
//         rotation: [toRads(-0), toRads(0), toRads(0)],
//         fov: 85,
//     },
//     {
//         name: 'dolly1',
//         position: [1.125, 7.5, 7.4],
//         rotation: [0,toRads(3),0],
//         fov: 85,
//         config: {mass: 1, tension: 10, friction: 100, duration: 3500},

//     },
//     {
//         name: 'pos2closeup',
//         position: [3, 7.25, 0],
//         rotation: [toRads(100), toRads(48), toRads(-32)],
//         fov: 85,
//         config: {clamp: true}
//         //set CA in a 90 degree 
//     },
//     {
//         name: 'dollyfrompos2',
//         position: [3, 7.4, 0],
//         rotation: [toRads(103), toRads(50.5), toRads(-30)],
//         fov: 85,
//         config: {mass: 1, tension: 10, friction: 100, duration: 5000},
//     },
//     {
//         name: 'mobile',
//         position: [44, 5, 7],
//         rotation: [toRads(-9), toRads(67), toRads(9)],
//         fov: 35,
//     },
// ]

function Scorecard({
    onClick = () => console.log('clicked project'), 
    selected = false,
    onSelect,
    showBody = false,
    falling,
    alone,
    ...props
}){


    const [forced, forceTo] = useState(null)
    const {camStatus} = useContext(WorldFunctions)

    useEffect(()=>{
        if(selected){
            console.log('SELECTED SCORECARD')
            forceTo({
                position: [0,7,0],
                rotation: [0,50,0]
            })
        }
        else{
            console.log('unpicked sc')
            // debugger
            forceTo(null)
            onSelect(null)
        }
    }, [selected])

    // useEffect(()=>{
    //     if(!camStatus){
    //         setCamDestination(camSprings[0])
    //     }
    //     if(camStatus === 'sc start'){
    //         console.log('changing view and submitting new shit ')
    //         setCamDestination(camSprings[1])
            
    //     }
    //     if(camStatus === 'dolly1'){
    //         setCamDestination(camSprings[2])
    //     }
    //     if(camStatus === 'pos2closeup'){
    //         setCamDestination(camSprings[3])
    //     }
    //     if(camStatus === 'dollyfrompos2'){
    //         setCamDestination(camSprings[4])
    //     }
    // }, [camStatus, selected])

    // useEffect(()=>{if(selected) onSelect(projectCamera)}, [selected, projectCamera])

    // const [countyUIanim, setCountyUIAnim, stop] = useSpring(()=>({
    //     opacity: 0, scale: [0.1,0.1,0.1], position: [0,0,0]
    // }))

    //tracks whether forced motion on a body is done (the body component will use the callback when its own tween finishes)
    const [doneForcing, changeDoneForcing] = useState(false)

    // useEffect(()=>{
    //     //animations herein
    //     if(d[vis]){
    //         const currentVis = d[vis]
    //         setSprings(i => {
    //             const cty = ca.__$[i].name
    //                 const cv = pcts[currentVis][cty]
    //                 return {
    //                     scale: [1,1, cv || pcts[currentVis].baseZ], 
    //                     color: selected? pcts[currentVis].colorRange(cv || pcts[currentVis].baseZ).hex() 
    //                         : greyRange(cv || pcts[currentVis].baseZ).hex(),
    //                     delay: 25 * i,
    //                     onRest: () => {if(i===12){
    //                         //janky way to tell when all counties are done if i need it
    //                         changeVis(vis < 2? vis+1 : 0)
    //                     }}
    //                 }
                
    //         })
    //     }
    //     if(
    //         selected 
    //         && doneForcing 
    //         // && alone //with one other project its awk
    //     ){
    //         setCountyUIAnim({opacity: 1, position: [-50, 35, 0.1], scale: [0.125,0.125,0.125] })
    //     }
    //     else{
    //         setCountyUIAnim({opacity: 0, position: [0,0,0], scale: [0.01, 0.01,0.01] })
    //     }
    // }, [vis, selected, doneForcing, alone])


    return( <Body 
        name = 'scorecard'
        key = 'scorecard'
        shapes = {['box', 'box']}
        shapeParams = {[
            // {size: [2.25,6,1], offset: [0,0,0], rotation: [0, 0, toRads(38)]}
            {size: [1.7,3.75,1.7], offset: [0.7,-.9,0], rotation: [0, 0, toRads(44)]},
            {size: [1.7,1.5,1.7], offset: [-1,1.8,0]}
        ]}
        forced = {forced}
        visible = {true}
        falling = {falling}
        onForceFinish = {changeDoneForcing}
        {...props}
    >
        <group key = 'what' name = 'fuckyou'>
            <mesh>
                <boxBufferGeometry attach = 'geometry' args = {[1,1,1]} />
                <meshNormalMaterial />
            </mesh>

        </group>

    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function ScorecardWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Scorecard {...props} /></Suspense>
}
