import React, {Suspense, useEffect, useState, useContext, useRef} from 'react'
import {animated} from 'react-spring'
// import * as THREE from 'three'

import {Dom} from 'react-three-fiber'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../../utils/3d'
import {LineTo} from '../../../utils/LineTo'
import {DumbCube} from '../../../utils/DumbCube'

import {Body} from '../../core/Body'
import Model from './SCModel'

import {userStore} from '../../../App'

export {SCPage} from './SCPage'

const BlurbTitle = () => (<animated.h1 key = 'title'> Scorecard of California children's well-being </animated.h1>)
const Blurb = () => (<animated.p key = 'blurb' >A web tool for exploring children's health, education, and welfare data in California and all its counties, filterable by race and year. Designed and developed for Children Now, a nonprofit that uses it in meetings with local leaders
(government, foundations, nonprofits) to highlight and advocate for children's needs.</animated.p>)
const Button = () => {
    const study = userStore(store => store.study)
    return <animated.button key = 'btn' onClick = {()=> study('scorecard')}> View case study </animated.button>
}

export const SCBlurb = [
    <BlurbTitle />,
    <Blurb />,
    <Button />
]



export default function Scorecard({
    onClick = () => console.log('clicked project'), 
    selected = false,
    onSelect,
    showBody = false,
    falling,
    alone,
    ...props
}){

    const setA = userStore(store => store.setA)
    const testAnchor = useRef()

    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            console.log('SELECTED SCORECARD')
            forceTo({
                position: [0,0,0],
                rotation: [0,0,0]
            })
            setA(testAnchor.current)
        }
        else{
            console.log('unpicked sc')
            // debugger
            forceTo(null)
            onSelect(null)
            setA(null)
        }
    }, [selected])

    //tracks whether forced motion on a body is done (the body component will use the callback when its own tween finishes)
    const [doneForcing, changeDoneForcing] = useState(false)

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
        visible = {false}
        falling = {falling}
        onForceFinish = {changeDoneForcing}
        {...props}
    >
        <Suspense fallback = {<React.Fragment />} >
            <Model 
                position = {[0.15, 0, -0.4]}
                selected = {selected}
                onClick = {onClick}
            />
        </Suspense>

        <mesh 
            ref = {testAnchor}
            scale = {[0.25,0.25,0.25]}
            position = {[0,0,1]}
            visible = {false}
        >
            <planeBufferGeometry attach='geometry' args = {[3,3]} />
            <meshBasicMaterial attach = 'material' color = {0x0000ff}/>
        </mesh>


    
    </Body>)
}
