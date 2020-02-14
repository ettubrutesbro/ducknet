import React, {Suspense, useEffect, useState, useContext, useRef} from 'react'
import * as THREE from 'three'


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../../utils/3d'

import {Body} from '../../core/Body'
import Model from './SCModel'

export default function Scorecard({
    onClick = () => console.log('clicked project'), 
    selected = false,
    onSelect,
    showBody = false,
    falling,
    alone,
    ...props
}){


    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            console.log('SELECTED SCORECARD')
            forceTo({
                position: [0,0,0],
                rotation: [0,0,0]
            })
        }
        else{
            console.log('unpicked sc')
            // debugger
            forceTo(null)
            onSelect(null)
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
        // visible = {true}
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


    
    </Body>)
}
