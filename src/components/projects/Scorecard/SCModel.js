import React, {Suspense, useEffect, useState, useContext} from 'react'
import {useLoader} from 'react-three-fiber'
import * as THREE from 'three'
import {a, useSprings, useSpring, config} from 'react-spring/three'
import chroma from 'chroma-js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {Spring} from '../../../utils/spring'
import {toRads} from '../../../utils/3d'

import {cameraContext} from '../../core/Camera'


export default function SCModel({
    pose,
    selected, //only here bc colors vary depending on selection - selection/pose handled by proj
    onClick = () => {console.log('clicked model')}, //archaic? the model is what must register the click...
    ...props
}){
    //ASSETS
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    const ca = useLoader(GLTFLoader, '/scorecard/resplit.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })
    const phonebldg = useLoader(GLTFLoader, '/scorecard/phonebldg4.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })

    const pseudoui = useLoader(OBJLoader, '/scorecard/pseudoui.obj')

    const caTexture = useLoader(THREE.TextureLoader, '/scorecard/peelshade.png' )
    caTexture.flipY = false
    const phonebldgTexture = useLoader(THREE.TextureLoader, '/scorecard/phonebldgbake-12-shift.png' )
    phonebldgTexture.flipY = false

    const phonebldgAlpha = useLoader(THREE.TextureLoader, '/scorecard/phonebldgalpha.png' )
    phonebldgAlpha.flipY = false

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

    console.log('rerender scmodel?')
    useEffect(()=>{
        const currentVis = d[vis]
            setSprings(i => {
                const cty = ca.__$[i].name
                    const cv = pcts[currentVis][cty]
                    return {
                        scale: [1,1, cv || pcts[currentVis].baseZ], 
                        color: selected? pcts[currentVis].colorRange(cv || pcts[currentVis].baseZ).hex() 
                            : greyRange(cv || pcts[currentVis].baseZ).hex(),
                        // delay: 25 * i,
                        onRest: () => {if(i===12){
                            changeVis(vis < 2? vis+1 : 0)
                        }}
                    }
                
            })
    }, [vis])
    //semi ambient anim: light color changes, but the light's only on if object is selected and in pose 3
    const lightFromPhone = Spring([
        {color: '#9AFFE3', intensity: 0.5},
        {color: '#ABDCFF', intensity: 0.65}, 
        {color: '#7EF9BE', intensity: 0.65} 
    ], vis)


    //ANIMATION: POSES
    /* on selection, various pseudo UI elements and phone/hand/govt bldg alternate appearing around
    the CA model, giving an impression of complex, connected data augmentation, and showing how the 
    app might be intended to be used
    */

    const {cam, setCam} = useContext(cameraContext)

    useEffect(()=>{ //when POSE changes, set cosmetic rotation group & camera accordingly
        console.log(pose)
        if(pose || pose === 0){
            setCam(camposes[pose])
        }
        else{
            setCam(null)
        }
    }, [pose])

    const camposes = [
        {
            name: 'idle', //idle
            position: [0,0,45],
            rotation: [toRads(-0), toRads(0), toRads(0)],
            fov: 85,
        },
        {
            name: 'pseudo',
            position: [-4.75,0.5,8],
            rotation: [toRads(-0), toRads(-40), toRads(0)],
            fov: 85,
        },
        {
            name: 'blurb',
            position: [-3,-1,4.5],
            rotation: [toRads(20),toRads(-45),toRads(-10)],
            fov: 65,
            // config: {mass: 1, tension: 10, friction: 100, duration: 3500},
        },
        {
            name: 'mobile',
            position: [-24,2,53],
            rotation: [toRads(-6),toRads(-32),toRads(-3)],
            fov: 32,
            config: {mass: 7, tension: 200, friction: 70},
        },
    ]

    //ANIMS: groups of individual springs for diff. geometries

    //0-3: 'global' rotations
    const rotation = Spring([
        {rotation: [toRads(0), toRads(0), toRads(0)]}, //idle
        {rotation: [toRads(0), toRads(15), toRads(0)]}, //pseudo
        {rotation: [toRads(-37), toRads(-16), toRads(-10)]}, //blurb
        {rotation: [toRads(0), toRads(-40), toRads(0)]}, //mobile
    ], pose || pose === 0? pose : 0)

    //1: pseudo UI
    const pseudo = Spring([
        {opacity: 0, scale: [0.08, 0.08, 0.08], position: [-35, 20, 0]},
        {opacity: 1, scale: [0.15, 0.15, 0.15], position: [-54, 41, 5]}
    ], pose === 1? 1 : 0)

    //2: blurbs

    //3: hand, phone, bldg
    //this group requires extra logic for toggling WOB visibility / making sure they
    //re not still present during unselect transition or other animations
    const [wobs, toggleWobs] = useState(false)
    useEffect(()=>{
        if(pose===3) toggleWobs(true)
        if(!selected) toggleWobs(false)
        console.log('wobs:', wobs)
    }, [pose, selected])

    const hand = Spring([
        {position: [0,0,-135], onRest: ()=> toggleWobs(false)}, 
        {position: [0,0,0], delay: 400, onRest: ()=>console.log('hand 1')}
    ], pose === 3? 1 : 0)
    const wobhand = Spring([
        {position: [0,0,-135]}, 
        {position: [0,1350,-135], delay: 175, config: config.molasses}
    ], pose === 3? 1 : 0)
    const bldg = Spring([{position: [0,0,0]}, {position: [0,550,0], delay: 550, config: config.slow}], pose === 3? 1 : 0)
    const bldgshadow = Spring([
        {scale: [1,1,0.2], position: [0,0,850], opacity: -0.5}, 
        {scale: [1,1,1], position: [0,0,0], opacity: 1, delay: 600, config: config.slow}
    ], pose === 3? 1 : 0)

    // console.log(rotation.rotation)

    return(
        <a.group 
            name = 'scorecardmodel'
            scale = {[.075, .075, .075]}
            onClick = {onClick}
            // rotation = {[rotation.x, rotation.y, rotation.z]}
            rotation = {rotation.rotation}

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
                                key = {county.name+'mtl'}
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
                name = 'wobvisibilitygroup' //contains all phone/bldg 
                visible = {wobs}
                scale = {[0.179,0.179,0.179]}
                position = {[-60, 75, -63]}
                //visible only when alone (otherwise WOB will destroy the heap)
            >
                <a.group name = 'swatchgroup' position = {hand.position}>
                    {[1,2,3,4].map((c,i)=>{
                        return <mesh name = {'swatch'+i} key = {'swatch'+i}
                            position = {[395, -350 + ((i*22) + (i*11)), 369]}
                        >
                            <planeBufferGeometry attach = 'geometry' args = {[15,22]} />
                            <a.meshBasicMaterial attach = 'material'
                                color = {selected? pcts[d[vis]].colorRange((i+1)*0.6).hex()
                                    : greyRange((i+1)*0.5).hex()
                                }
                             />
                        </mesh>
                    })}
                </a.group>

                {phonebldg.__$.filter(c => c.name === 'hand').map((child) => {
                    return <a.mesh name = 'hand' key = 'hand'
                        position = {hand.position}
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial 
                            attach = 'material' 
                            map = {phonebldgTexture}
                            alphaMap = {phonebldgAlpha}
                            // color = {0xdedede}
                        />
                    </a.mesh>
                })}
                {phonebldg.__$.filter(c => c.name === 'WOBhand').map((child) => {
                    return <a.mesh name = 'wobhand' key = 'wobhand'
                        position = {wobhand.position}
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial 
                            attach = 'material' 
                            color = {0xffffff}
                            // transparent
                            // opacity = {0.7}                      
                        />
                    </a.mesh>
                })}
                <group position = {[250,-400,400]} >
                    <a.pointLight 
                        color = {lightFromPhone.color}
                        intensity = {lightFromPhone.intensity} 
                    />
                    <mesh visible = {false}>
                        <boxBufferGeometry attach = 'geometry' args = {[100,100,100]} />
                        <meshNormalMaterial attach = 'material' />
                    </mesh>
                </group>

                <group
                    rotation = {[0, toRads(-13), 0]}
                    position = {[100, 0, 80]}
                >
                    {phonebldg.__$.filter(c => c.name === 'bldg').map((child) => {
                        return <a.mesh name = 'bldg' key = 'bldg'
                            position = {bldg.position}
                        >
                            <bufferGeometry attach = 'geometry' {...child.geometry} />
                            <meshLambertMaterial 
                                attach = 'material' 
                                emissiveMap = {phonebldgTexture}
                                emissiveIntensity = {0.75}
                                color = {0xdedede}
                                emissive = {0xffffff}
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
                                opacity = {bldgshadow.opacity}
                                transparent
                            />
                        </a.mesh>
                    })}

                    {phonebldg.__$.filter(c => c.name === 'WOBbldg').map((child) => {
                        return <mesh name = 'wobbldg' key = 'wobbldg'
                            
                        >
                            <bufferGeometry attach = 'geometry' {...child.geometry} />
                            <meshBasicMaterial 
                                attach = 'material' 
                                color = {0xffffff}
                            />
                        </mesh>
                    })}

                </group>

            </a.group>
            
            

        </a.group>
    )
}
