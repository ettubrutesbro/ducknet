import React, {Suspense, useEffect, useState, useContext} from 'react'
import {useLoader} from 'react-three-fiber'
import * as THREE from 'three'
import {a, useSprings, useSpring} from 'react-spring/three'
// import useInterval from 'use-interval'
// import useTimeout from 'use-timeout'
import chroma from 'chroma-js'

import {Body} from '../core/Body'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../utils/3d'

import {WorldFunctions} from '../../App'

const camSprings = [
    {
        name: 'sc start',
        position: [1, 7.5, 8],
        rotation: [toRads(-0), toRads(0), toRads(0)],
        fov: 85,
    },
    {
        name: 'dolly1',
        position: [1.125, 7.5, 7.4],
        rotation: [0,toRads(3),0],
        fov: 85,
        config: {mass: 1, tension: 10, friction: 100, duration: 3500},

    },

    {
        name: 'pos2closeup',
        position: [3, 7.25, 0],
        rotation: [toRads(100), toRads(48), toRads(-32)],
        fov: 85,
        config: {clamp: true}
        //set CA in a 90 degree 
    },
    {
        name: 'dollyfrompos2',
        position: [3, 7.4, 0],
        rotation: [toRads(103), toRads(50.5), toRads(-30)],
        fov: 85,
        config: {mass: 1, tension: 10, friction: 100, duration: 5000},
    },
    {
        name: 'mobile',
        position: [18, 7, -4],
        rotation: [toRads(9), toRads(95), toRads(9)],
        fov: 47,
    },
]

function Scorecard({
    onClick = () => console.log('clicked project'), 
    selected = false,
    onSelect,
    showBody = false,
    falling,
    alone,
    ...props
}){

    const offsetFromPhys = [0.15,0,-0.4]

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    const ca = useLoader(GLTFLoader, '/scorecard/resplit.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })
    const countyui = useLoader(OBJLoader, '/scorecard/countyui.obj')
    const raceui = useLoader(OBJLoader, '/scorecard/raceui.obj')
    const demoui = useLoader(OBJLoader, '/scorecard/demoui.obj')
    const blurb = useLoader(OBJLoader, '/scorecard/blurb.obj')

    const [projectCamera, setCamDestination] = useState(camSprings[0])

    const texture = useLoader(THREE.TextureLoader, '/scorecard/peelshade.png' )
    texture.flipY = false

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

    useEffect(()=>{
        if(!camStatus){
            setCamDestination(camSprings[0])
        }
        if(camStatus === 'sc start'){
            console.log('changing view and submitting new shit ')
            setCamDestination(camSprings[1])
            
        }
        if(camStatus === 'dolly1'){
            setCamDestination(camSprings[2])
        }
        if(camStatus === 'pos2closeup'){
            setCamDestination(camSprings[3])
        }
        if(camStatus === 'dollyfrompos2'){
            setCamDestination(camSprings[4])
        }
    }, [camStatus, selected])

    useEffect(()=>{if(selected) onSelect(projectCamera)}, [selected, projectCamera])

    const d = ['dental', 'breastfeeding', 'meals']
    const [vis, changeVis] = useState(0)

    const loadedNameOrder = ca.__$.map(c => c.name)

    const [springs, setSprings] = useSprings(13, i => ({
        scale: [1,1,1],
        color: '#dedede',
        config: { mass: 1, tension: 120, friction: 32 }
    }))
    const greyRange = chroma.scale(['#ededed', '#dedede', '#c1c1c1']).domain([0, 1.5])
    const pcts = {
        dental: { 
            modoc: 0.75,
            pseudonorth: 0.8,
            lassen: .925, 
            siskiyou: .675,
            pseudocentral: 0.625,
            pseudocoast: .84,
            sanbernie: 0.5,
            sandiego: 0.55,
            sfsm: .975,
            mendo: 1.05,
            inyo: .75,
            baseZ: 0.7,
            colorRange: chroma.scale(['#d6f0ee', '#97D7C8',  '#3CA77A']).mode('lab').domain([.55, .7, 1.05])
        },
        breastfeeding: {
            //this range is too big, adjust it so that the peaks aren't so much larger (80%!)
            modoc: 1.8,
            siskiyou: 1.7, 
            lassen: 1.6,
            sandiego: 1.66,
            inyo: 1.8,
            pseudonorth: 1.25,
            pseudocentral: 1.3,
            pseudocoast: 1,
            pseudosouth: 1.1,
            sfsm: 1.7,
            mendo: 1.6, 
            baseZ: 1.325,
            colorRange:chroma.scale(['#94B6D7', '#4998C5', '#056FAF', '#034E7A']).mode('lab').domain([1.1, 1.4, 1.6, 1.8]) 
        },
        meals: { 
            modoc: 1.15,
            mendo: 1,
            sanbernie: 1.17,
            pseudosouth: 1.13,
            pseudocentral: 1.35,
            pseudocoast: 1.22,
            sandiego: 1,
            siskiyou: 1.05,
            inyo: 0.88,
            lassen: 0.95,
            baseZ: 1.08,
            colorRange: chroma.scale(['#87D0BC', '#54b88e', '#0E855A']).mode('lab').domain([.88, 1.1, 1.35])
        },
    }

    const [countyUIanim, setCountyUIAnim, stop] = useSpring(()=>({
        opacity: 0, scale: [0.1,0.1,0.1], position: [0,0,0]
    }))

    //tracks whether forced motion on a body is done (the body component will use the callback when its own tween finishes)
    const [doneForcing, changeDoneForcing] = useState(false)

    useEffect(()=>{
        //animations herein
        if(d[vis]){
            const currentVis = d[vis]
            setSprings(i => {
                const cty = ca.__$[i].name
                    const cv = pcts[currentVis][cty]
                    return {
                        scale: [1,1, cv || pcts[currentVis].baseZ], 
                        color: selected? pcts[currentVis].colorRange(cv || pcts[currentVis].baseZ).hex() 
                            : greyRange(cv || pcts[currentVis].baseZ).hex(),
                        delay: 25 * i,
                        onRest: () => {if(i===12){
                            //janky way to tell when all counties are done if i need it
                            changeVis(vis < 2? vis+1 : 0)
                        }}
                    }
                
            })
        }
        if(
            selected 
            && doneForcing 
            // && alone //with one other project its awk
        ){
            setCountyUIAnim({opacity: 1, position: [-50, 35, 0.1], scale: [0.125,0.125,0.125] })
        }
        else{
            setCountyUIAnim({opacity: 0, position: [0,0,0], scale: [0.01, 0.01,0.01] })
        }
    }, [vis, selected, doneForcing, alone])


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

        onForceFinish = {changeDoneForcing}

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
                        />


                    </a.mesh>
                )           
            })}

       <a.group 
            scale = {countyUIanim.scale}
            position = {countyUIanim.position}
        >
            {/* left data thing... */}
            {countyui.children.map((child) => {
                return <mesh key = {child.name}>
                    <bufferGeometry attach = 'geometry' {...child.geometry} />
                    <a.meshBasicMaterial 
                        attach = 'material' 
                        color = {0xdedede}
                        opacity = {countyUIanim.opacity}
                        transparent
                        needsUpdate
                    />
                </mesh>
            })}

        </a.group>
       <a.group 
            scale = {countyUIanim.scale}
            // scale = {}
            position = {countyUIanim.position}
        >
            {raceui.children.map((child) => {
                return <mesh key = {child.name}>
                    <bufferGeometry attach = 'geometry' {...child.geometry} />
                    <a.meshBasicMaterial 
                        attach = 'material' 
                        color = {0xdedede}
                        // opacity = {countyUIanim.opacity}
                        transparent
                        needsUpdate
                    />
                </mesh>
            })}

        </a.group>
       <a.group 
            scale = {countyUIanim.scale}
            // scale = {}
            position = {countyUIanim.position}
        >
            {demoui.children.map((child) => {
                return <mesh key = {child.name}>
                    <bufferGeometry attach = 'geometry' {...child.geometry} />
                    <a.meshBasicMaterial 
                        attach = 'material' 
                        color = {0xdedede}
                        // opacity = {countyUIanim.opacity}
                        transparent
                        needsUpdate
                    />
                </mesh>
            })}

        </a.group>
 
        </group>



    
    </Body>)
}

// this might get cumbersome but it's what i have rn
export default function ScorecardWrapped(props){
  return <Suspense fallback = {<React.Fragment />}><Scorecard {...props} /></Suspense>
}
