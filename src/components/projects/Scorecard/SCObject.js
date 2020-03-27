import React, {Suspense, useEffect, useState, useContext, useRef} from 'react'

import {Dom} from 'react-three-fiber'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import {toRads} from '../../../utils/3d'
import {LineTo} from '../../../utils/LineTo'
import {DumbCube} from '../../../utils/DumbCube'

import {Body} from '../../core/Body'
import {SCModel} from './SCModel'

import {userStore} from '../../../App'

export function SCObject({
    onClick = () => console.log('clicked project'), 
    selected = false,
    onSelect,
    falling,
    showBody = false,
    ...props
}){

    const setA = userStore(store => store.setA)
    const testAnchor = useRef()

    const [forced, forceTo] = useState(null)

    useEffect(()=>{
        if(selected){
            console.log('SELECTED SCORECARD')
            forceTo({
                position: [-.65,-0.1,-.1],
                rotation: [0,0,0]
            })
            setA(testAnchor.current)
        }
        else{
            console.log('unpicked sc')
            // debugger
            forceTo(null)
            // console.log('scobject setcam')
            // onSelect(null)
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
            <SCModel 
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




// const components = {
//     model: Scorecard,
//     blurb: SCBlurb,
//     page: SCPage
// }


// export default components