import React, {Suspense, useEffect, useState, useContext} from 'react'
import {useLoader} from 'react-three-fiber'
import * as THREE from 'three'
import {a, useSprings, useSpring} from 'react-spring/three'
import chroma from 'chroma-js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

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
    const phonebldg = useLoader(GLTFLoader, '/scorecard/phonebldg-notexopt.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })

    const countyui = useLoader(OBJLoader, '/scorecard/countyui.obj')
    const raceui = useLoader(OBJLoader, '/scorecard/raceui.obj')
    const demoui = useLoader(OBJLoader, '/scorecard/demoui.obj')

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
    const greyRange = chroma.scale(['#ededed', '#dedede', '#9a9a9a']).domain([0, 1.5])  

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


    return(
        <group 
            scale = {[.075, .075, .075]}
            position = {[0.15, 0, -0.4]}
            onClick = {onClick}
        >
                {springs.map(({scale,color}, i)=>{
                    const county = ca.__$[i]
                    return(
                        <mesh 
                            key = {county.name}
                            name = {county.name}
                            // scale = {scale}
                        >
                            <bufferGeometry attach = 'geometry' {...county.geometry} />
                            <meshBasicMaterial
                                // color = {color}
                                attach ='material'
                                map = {caTexture}
                            />
                        </mesh>
                    )           
                })}

            {/* NOTE: All this pseudo UI could probably just be in one model, reducing lines here...*/}
        {/* 
            <group name = 'countyui'>
                {countyui.children.map((child) => {
                    return <mesh key = {child.name}>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            color = {0xdedede}
                        />
                    </mesh>
                })}
            </group>

            <group name = 'raceui'>
                {countyui.children.map((child) => {
                    return <mesh key = {child.name}>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            color = {0xdedede}
                        />
                    </mesh>
                })}
            </group>

            <group name = 'demoui'>
                {demoui.children.map((child) => {
                    return <mesh key = {child.name}>
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            color = {0xdedede}
                        />
                    </mesh>
                })}
            </group> 

            <a.group 
                scale = {[0.175,0.175,0.175]}
                position = {[-60, 65, -60]}
                visible = {false}
            >
                {phonebldg.__$.filter(child => !child.name.includes('WOB')).map((child) => {
                    return <mesh 
                        key = {child.name} 
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <meshBasicMaterial 
                            attach = 'material' 
                            map = {phonebldgTexture}
                            // opacity = {child.name.includes('WOB')? 0.1 : 1}
                            transparent
                            needsUpdate
                        />
                    </mesh>
                })}

            </a.group>
            */}

        </group>
    )
}
