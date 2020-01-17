import React, {Suspense, useEffect, useState, useContext} from 'react'
import {useLoader} from 'react-three-fiber'
import * as THREE from 'three'
import {a, useSprings, useSpring} from 'react-spring/three'
import chroma from 'chroma-js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {Spring} from '../../../utils/spring'

export default function SCModel({
    selected,
    onClick = () => {console.log('clicked model')}, //archaic? the model is what must register the click...
    ...props
}){
    //ASSETS
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    const ca = useLoader(GLTFLoader, '/scorecard/resplit.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })
    const phonebldg = useLoader(GLTFLoader, '/scorecard/phonebldg2.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })

    const pseudoui = useLoader(OBJLoader, '/scorecard/pseudoui.obj')

    const caTexture = useLoader(THREE.TextureLoader, '/scorecard/peelshade.png' )
    caTexture.flipY = false
    const phonebldgTexture = useLoader(THREE.TextureLoader, '/scorecard/phonebldgbake-16.png' )
    phonebldgTexture.flipY = false

    //ANIMATION: AMBIENT
    //at all times, percentages are being passed to the county geometries, causing them to 
    //change colors and undulate on the Z-scale. 
    const d = ['dental', 'breastfeeding', 'meals']
    const [vis, changeVis] = useState(0)
    const [springs, setSprings] = useSprings(13, i => ({
        scale: [1,1,1],
        color: '#dedede',
        config: { mass: 1, tension: 120, friction: 32 }
    }))
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
    const greyRange = chroma.scale(['#ededed', '#dedede', '#9f9f9f']).domain([0, 1.5])  

    useEffect(()=>{
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
                            changeVis(vis < 2? vis+1 : 0)
                        }}
                    }
                
            })
    }, [vis])


    //ANIMATION: POSES
    /* on selection, various pseudo UI elements and phone/hand/govt bldg alternate appearing around
    the CA model, giving an impression of complex, connected data augmentation, and showing how the 
    app might be intended to be used
    */

    const poses = [
        // {
        //     name: 'sc start',
        //     position: [1, 7.5, 8],
        //     rotation: [toRads(-0), toRads(0), toRads(0)],
        //     fov: 85,
        // },
        // {
        //     name: 'dolly1',
        //     position: [1.125, 7.5, 7.4],
        //     rotation: [0,toRads(3),0],
        //     fov: 85,
        //     config: {mass: 1, tension: 10, friction: 100, duration: 3500},

        // },
        // {
        //     name: 'pos2closeup',
        //     position: [3, 7.25, 0],
        //     rotation: [toRads(100), toRads(48), toRads(-32)],
        //     fov: 85,
        //     config: {clamp: true}
        //     //set CA in a 90 degree 
        // },
        // {
        //     name: 'dollyfrompos2',
        //     position: [3, 7.4, 0],
        //     rotation: [toRads(103), toRads(50.5), toRads(-30)],
        //     fov: 85,
        //     config: {mass: 1, tension: 10, friction: 100, duration: 5000},
        // },
        // {
        //     name: 'mobile',
        //     position: [44, 5, 7],
        //     rotation: [toRads(-9), toRads(67), toRads(9)],
        //     fov: 35,
        // },
    ]

    const pseudo = Spring([
        {opacity: 0, scale: [0.08, 0.08, 0.08], position: [-35, 20, 0]},
        {opacity: 1, scale: [0.15, 0.15, 0.15], position: [-54, 41, 5]}
    ], props.showPseudo? 1 : 0)

    const bldg = Spring([{position: [0,0,0]}, {position: [0,550,0]}], props.showBldg? 1 : 0)

    const bldgshadow = Spring([
        {scale: [1,1,0.2], position: [0,0,850], opacity: -0.5 }, 
        {scale: [1,1,1], position: [0,0,0], opacity: 1, delay: 50}
    ], props.showBldg? 1 : 0)


    return(
        <group 
            scale = {[.075, .075, .075]}
            // position = {[0.15, 0, -0.4]}
            onClick = {onClick}
            {...props}
        >
                {springs.map(({scale,color}, i)=>{
                    const county = ca.__$[i]
                    return(
                        <a.mesh 
                            key = {county.name}
                            name = {county.name}
                            scale = {scale}
                        >
                            <bufferGeometry attach = 'geometry' {...county.geometry} />
                            <a.meshBasicMaterial
                                color = {color}
                                attach ='material'
                                map = {caTexture}
                            />
                        </a.mesh>
                    )           
                })}

            <a.group name = 'pseudoui'
                position = {pseudo.position}
                scale = {pseudo.scale}
            >
                {pseudoui.children.map((child) => {
                    return <mesh key = {child.name} >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            color = {0xdedede}
                            opacity = {pseudo.opacity}
                            transparent
                        />
                    </mesh>
                })}
            </a.group>
        
        
            <a.group 
                scale = {[0.175,0.175,0.175]}
                position = {[-60, 65, -60]}
                //visible only when alone (otherwise WOB will destroy the heap)
            >
                {phonebldg.__$.filter(c => c.name === 'hand').map((child) => {
                    return <mesh name = 'hand' key = 'hand'>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial 
                            attach = 'material' 
                            map = {phonebldgTexture}
                            color = {0xdedede}
                        />
                    </mesh>
                })}
                {phonebldg.__$.filter(c => c.name === 'WOBhand').map((child) => {
                    return <mesh name = 'wobhand' key = 'wobhand'>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshNormalMaterial 
                            attach = 'material' 
                            color = {0xffffff}
                            transparent
                            opacity = {0.5}
                        />
                    </mesh>
                })}
                {phonebldg.__$.filter(c => c.name === 'bldg').map((child) => {
                    return <a.mesh name = 'bldg' key = 'bldg'
                        position = {bldg.position}
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial 
                            attach = 'material' 
                            map = {phonebldgTexture}
                            color = {0xdedede}
                        />
                    </a.mesh>
                })}
                {phonebldg.__$.filter(c => c.name === 'bldgshadow').map((child) => {
                    return <a.mesh name = 'bldgshadow' key = 'bldgshadow'
                        scale = {bldgshadow.scale}
                        position = {bldgshadow.position}
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            map = {phonebldgTexture}
                            color = {0xdedede}
                            opacity = {bldgshadow.opacity}
                            transparent
                        />
                    </a.mesh>
                })}
                {phonebldg.__$.filter(c => c.name === 'WOBbldg').map((child) => {
                    return <mesh name = 'wobbldg' key = 'wobbldg'>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial 
                            attach = 'material' 
                            color = {0xffffff}
                        />
                    </mesh>
                })}

            </a.group>
            
            

        </group>
    )
}
