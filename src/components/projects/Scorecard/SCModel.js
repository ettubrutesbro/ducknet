import React, {Suspense, useEffect, useState, useContext} from 'react'
import {useLoader} from 'react-three-fiber'
import * as THREE from 'three'
import {a, useSprings, useSpring, config} from 'react-spring/three'
import chroma from 'chroma-js'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../../utils/3d'
import {randBtwn} from '../../../utils/basicMath'

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
    const pseudoui = useLoader(GLTFLoader, '/scorecard/pseudoblurb7.gltf', loader => {
      loader.setDRACOLoader(dracoLoader)
    })
    const blurbs = useLoader(OBJLoader, '/scorecard/blurbs3.obj')

    const caTexture = useLoader(THREE.TextureLoader, '/scorecard/peelshade.png' )
    caTexture.flipY = false
    const phonebldgTexture = useLoader(THREE.TextureLoader, '/scorecard/phonebldgbake-12-shift.png' )
    phonebldgTexture.flipY = false
    const phonebldgAlpha = useLoader(THREE.TextureLoader, '/scorecard/phonebldgalpha.png' )
    phonebldgAlpha.flipY = false
    const pseudoTex = useLoader(THREE.TextureLoader, '/scorecard/pseudoblurb512.png' )
    pseudoTex.flipY = false
    const blurbShadows = useLoader(THREE.TextureLoader, '/scorecard/blurbshadows.png' )
    blurbShadows.flipY = false

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
            //mendo
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
            colorRange: chroma.scale(['#d6f0ee', '#97D7C8',  '#3CA77A']).mode('lab').domain([.55, .7, 1.05]),
            showBlurb: 'mendo'
        },
        breastfeeding: {
            //modoc
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
            colorRange:chroma.scale(['#94B6D7', '#4998C5', '#056FAF', '#034E7A']).mode('lab').domain([1.1, 1.4, 1.6, 1.8]) ,
            showBlurb: 'modoc'
        },
        meals: { 
            //central
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
            colorRange: chroma.scale(['#87D0BC', '#54b88e', '#0E855A']).mode('lab').domain([.88, 1.1, 1.35]),
            showBlurb: 'pseudocentral'
        },
    }
    const greyRange = chroma.scale(['#ededed', '#dedede', '#9f9f9f']).domain([0, 1.5])
    //calculate colors and lengths for bar graphs 
    const genericRangeQuartiles = [
        [.5, .525, .95, 1.3], [1.1, 1.4, 1.6, 1.8], [.88, 1, 1.4, 1.5]
    ]
    const countyBarColors = Object.keys(pcts).map((v, i)=>{
        return genericRangeQuartiles[i].map((q)=>pcts[v].colorRange(q).hex()) 
    })
    let countyBarLengths = genericRangeQuartiles.map((q)=>{
        //the 2 enables each vis to differ in proportion instead of being %s of 100% (/q[3])
        return q.map((v)=> Number((v/2).toFixed(3)) )
    })
    let raceBarColors = genericRangeQuartiles.map(()=>[])
    const raceBarLengths = genericRangeQuartiles.map((q,i)=>{
        return [1,1,1].map(()=> {
            const rand = randBtwn(.4, .95)
            raceBarColors[i].push(pcts[Object.keys(pcts)[i]].colorRange(rand*q[3]).hex())
            return rand
        })
    })

    const [bars, setBars] = useSprings(7, i => ({
        scale: [1,1,1],
        color: '#dedede',
    }))

    const [blurbAnims, setBlurbs] = useSprings(3, i => ({
        opacity: 0,
        position: [0,0,0],
        scale: [1,1,0.01],
        rotation: [toRads(-15), 0, 0]
    }))

    useEffect(()=>{
        const currentVis = d[vis]
        setSprings(i => {
            const cty = ca.__$[i].name
                const cv = pcts[currentVis][cty]
                return {
                    scale: [1,1, cv || pcts[currentVis].baseZ], 
                    // scale: [1,1,1], 
                    color: selected? pcts[currentVis].colorRange(cv || pcts[currentVis].baseZ).hex() 
                        : greyRange(cv || pcts[currentVis].baseZ).hex(),
                    delay: 25 * i,
                    onRest: () => {if(i===12){
                        changeVis(vis < 2? vis+1 : 0)
                    }}
                }
            
        })
        setBars(i => {
            return{
                // whichBar === 'county'? [((-230-54) * (1-countyBarLengths[vis][3-number])/2),0,0]
                position: i < 4? [((-230 - 54) * (1-countyBarLengths[vis][3-i])) / 2, 0, 0] 
                    : [((-160 - 54) * (1-raceBarLengths[vis][i-4]))/2,0,0],
                scale: i < 4? [countyBarLengths[vis][3-i],1,1] : [raceBarLengths[vis][i-4],1,1],
                color: i < 4? countyBarColors[vis][3-i] : raceBarColors[vis][i-4]
            }
        })
        setBlurbs(i => {
            return{
                opacity: vis===i? 1 : 0,
                position: vis === i? [0,0,0] : [0,0,17.5],
                scale: [1,1,vis===i? 1 : 0.01],
                rotation: [toRads(vis===i? 0 : -15), 0, 0],
                delay: key => key === 'opacity'? 50 : 0,
            }
        })
    }, [vis])
    //semi ambient anim: light color changes, but the light's only on if object is selected and in pose 3
    const lightFromPhone = useSpringEffect([
        {color: '#9AFFE3', intensity: 0.5},
        {color: '#ABDCFF', intensity: 0.65}, 
        {color: '#7EF9BE', intensity: 0.65} 
    ], vis)


    // const blurbLight = useSpringEffect([

    // ])


    //ANIMATION: POSES
    /* on selection, various pseudo UI elements and phone/hand/govt bldg alternate appearing around
    the CA model, giving an impression of complex, connected data augmentation, and showing how the 
    app might be intended to be used
    */

    const {cam, setCam} = useContext(cameraContext)

    useEffect(()=>{ //when POSE changes, set cosmetic rotation group & camera accordingly
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

    const rotation = useSpringEffect([
        {rotation: [toRads(0), toRads(0), toRads(0)]}, //idle
        {rotation: [toRads(0), toRads(15), toRads(0)]}, //pseudo
        {rotation: [toRads(-37), toRads(-16), toRads(-10)]}, //blurb
        {rotation: [toRads(0), toRads(-40), toRads(0)]}, //mobile
    ], pose || pose === 0? pose : 0)

    const pseudo = useSpringEffect([
        {opacity: 0, scale: [0.08, 0.08, 0.08], position: [-35, 20, 0]},
        {opacity: 1, scale: [0.15, 0.25, 0.15], position: [-54, 41, 5]}
    ], pose ===1? 1 : 0)

    // const blurbsAnim = 

    const [wobs, toggleWobs] = useState(false)
    useEffect(()=>{
        if(pose===3) toggleWobs(true)
        if(!selected) toggleWobs(false)
        console.log('wobs:', wobs)
    }, [pose, selected])

    const hand = useSpringEffect([
        {position: [0,0,-135], onRest: ()=> toggleWobs(false)}, 
        {position: [0,0,0], delay: 400, onRest: ()=>console.log('hand 1')}
    ], pose === 3? 1 : 0)
    const wobhand = useSpringEffect([
        {position: [0,0,-135]}, 
        {position: [0,1350,-135], delay: 175, config: config.molasses}
    ], pose === 3? 1 : 0)
    const bldg = useSpringEffect([{position: [0,0,0]}, {position: [0,550,0], delay: 550, config: config.slow}], pose === 3? 1 : 0)
    const bldgshadow = useSpringEffect([
        {scale: [1,1,0.2], position: [0,0,850], opacity: -0.5}, 
        {scale: [1,1,1], position: [0,0,0], opacity: 1, delay: 600, config: config.slow}
    ], pose === 3? 1 : 0)


    return(
        <a.group 
            name = 'scorecardmodel'
            scale = {[.075, .075, .075]}
            onClick = {onClick}
            // rotation = {[rotation.x, rotation.y, rotation.z]}
            rotation = {rotation.rotation}

            {...props}
        >
            <group
                name = 'allblurbs'
                position = {[0,0, vis === 1? 2.5 : vis === 2? .5 : 0]}
                // position = {[0, 0, ((pcts[d[vis]][] - 1) * 7 + (county==='modoc'? 1.25 : county === 'pseudocentral'? 0.5 : 0))]}
            >
            <group 
                name = 'blurblightgroup'
                position = {[-3,-15,45]}
            >
            {pose === 2 &&
                <pointLight intensity = {3} color = {lightFromPhone.color}/>
            }
                <mesh>
                    <boxBufferGeometry attach = 'geometry' args = {[5,5,5]} />
                    <meshNormalMaterial attach = 'material' />
                </mesh>
            </group>

            {blurbs.children.map((child)=>{
                const name = child.name
                const county = child.name.includes('central')? 'pseudocentral' 
                    : name.includes('mendo')? 'mendo' 
                    : name.includes('modoc')? 'modoc'
                    : ''
                const isShadow = child.name.includes('shadow')
                const shaded = child.name.includes('shpitz') || child.name.includes('box')
                const index = county === 'mendo'? 0 : county === 'modoc'? 1 : 2

                return <a.mesh
                    name = {name} key = {name}
                    position = {
                        name.includes('box')? blurbAnims[index].position : [0,0,0]
                    }
                    scale = {name.includes('box')? blurbAnims[index].scale : [1,1,1] }
                    // rotation = {blurbAnims[index].rotation}
                    visible = {index === vis}
                >
                    <bufferGeometry attach = 'geometry' {...child.geometry} />
                    {!shaded && 
                        <a.meshBasicMaterial attach = 'material'
                            color = {name.includes('subtext')? 0x666666 : name.includes('text')? 0xdedede : 0x000000}
                            transparent
                            opacity = {blurbAnims[index].opacity}
                            alphaMap = {isShadow? blurbShadows : null}
                            // visible = {false}
                        />
                    }
                    {shaded && <meshLambertMaterial attach = 'material' color = {0x444444} emissive = {0x141414} /> }
                </a.mesh>

            })}
            </group>

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
                rotation = {[toRads(-90),0,0]}
                scale = {pseudo.scale}
            >
                {pseudoui.__$.filter(c =>!c.name.includes('Box')).map(child => {
                    return <mesh key = {child.name} >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            color = {0xdfdfdf}
                            opacity = {pseudo.opacity}
                            map = {pseudoTex}
                            transparent
                        />
                    </mesh>
                })}
                {pseudoui.__$.filter(c =>c.name.includes('Box')).map((child, i) => {
                    const number = Number(child.name.replace('Box',''))-1
                    const whichBar = number > 3? 'race' : 'county'
                    // console.log(countyBarLengths[vis][3-number])

                    console.log(bars[i])

                    return <a.mesh 
                        key = {child.name} 
                        scale = {bars[number].scale
                            // whichBar === 'county'? [countyBarLengths[vis][3-number],1,1]
                            // : [raceBarLengths[number-3],1,1]
                        }
                        //229 is the length of the bar, 54 is the final pseudo offset
                        position = {bars[number].position
                            // whichBar === 'county'? [((-230-54) * (1-countyBarLengths[vis][3-number])/2),0,0]
                            // : [-114.5 * raceBarLengths[number-3],1,1]
                        }
                    >
                        <bufferGeometry attach = 'geometry' {...child.geometry} />
                        <a.meshBasicMaterial 
                            attach = 'material' 
                            color = {bars[number].color }
                            opacity = {pseudo.opacity}
                            map = {pseudoTex}
                            transparent
                        />
                    </a.mesh>
                })}
            </a.group>
        
        
            <a.group 
                name = 'wobvisibilitygroup' //contains all phone/bldg 
                visible = {wobs}
                scale = {[0.179,0.179,0.179]}
                position = {[-60, 75, -63]}
                //visible only when alone (otherwise WOB will obscure the heap)
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

                {phonebldg.__$.filter(c => c.name === 'hand').map(child => {
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
                {phonebldg.__$.filter(c => c.name === 'WOBhand').map(child => {
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
                    {phonebldg.__$.filter(c => c.name === 'bldg').map(child => {
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
                    {phonebldg.__$.filter(c => c.name === 'bldgshadow').map(child => {
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

                    {phonebldg.__$.filter(c => c.name === 'WOBbldg').map(child => {
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


const useSpringEffect = (keys, currentKey) =>{

    const [key, setKey, stop] = useSpring(() => keys[currentKey])

    useEffect(()=>{
        stop()
        setKey(keys[currentKey])

    }, [currentKey])
    // console.log(key)
    return key
}