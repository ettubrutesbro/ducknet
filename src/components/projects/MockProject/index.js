/*
    What are the requirements of getting a project into the app? 
*/
import React, {Fragment, useState, useEffect, useRef} from 'react'
import {animated} from 'react-spring'

import {Body} from '../../core/Body'
import {DumbCube} from '../../../utils/DumbCube'
import {userStore} from '../../../App'
import useObjectSelection from '../../hooks/useObjectSelection'

function MockObject({
    name,
    onClick = () => console.log('clicked project [ONSELECT NEEDS PROP]'),
    selected = false,
    falling,
    showBody = true,
    ...props
}){

    const anchor = useRef()

    const forced = useObjectSelection(
        name, 
        selected, 
        {position: [0,3,0], rotation: [15,30,-20]}, 
        anchor
    )

    return <Body
        name = {name}
        key = {name}
        forced = {forced}
        falling = {falling}
        // onForceFinish = {changeDoneForcing}
        {...props}
    >
        {/* <Suspense> would normally wrap bc model loading has to happen */}
        
        <mesh
            ref = {anchor}
            onClick = {onClick}
        >
            <boxBufferGeometry attach = 'geometry' args = {[1,1,1]} />
            <meshNormalMaterial attach = 'material' />
        </mesh>
        {/* </Suspense> */}

    </Body>
}

const MockBlurb = () => {
    const study = userStore(store => store.study)
    return [<animated.h1> Project Title </animated.h1>,
    <animated.p> This paragraph should explain project, and give basic context - 0. name and time 1. what is it? 2. company/client + users + collaborators... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in purus dictum, mollis dolor vel, tempor ex. Vestibulum eu gravida nulla. Curabitur tortor sem, vehicula eget felis eget, malesuada sollicitudin lorem. Duis eget nulla id tellus maximus feugiat a nec purus.
    </animated.p>,
    <animated.button onClick = {()=> study('mockProject')}> View case study </animated.button>]
}

const MockPage = [
        <h3>Hello mock page </h3>,
        <p> This paragrph should begin with deeper context: more about client, how i got involved, precedents and specifics asks. Praesent vel pharetra neque, eget pellentesque arcu. Maecenas pulvinar, ligula eleifend volutpat pulvinar, libero nisi laoreet justo, eget fringilla arcu ex vitae sem. Sed posuere egestas felis eget accumsan.</p>,
        <p> Nam tincidunt ex quis arcu viverra, vel ornare nisi maximus. Suspendisse posuere nisl nec nunc gravida aliquet. Maecenas volutpat enim at enim convallis, eu gravida neque luctus. Nam vel sagittis neque. Pellentesque lacinia magna quis pellentesque malesuada. Ut quis nibh felis. Donec congue imperdiet aliquam. Maecenas commodo urna sed ipsum lacinia, sit amet rhoncus sem varius. In hac habitasse platea dictumst. Nullam consectetur in mi vitae rutrum. Integer ut euismod lacus. Vivamus lobortis scelerisque libero, nec viverra erat efficitur quis. Nunc est massa, imperdiet at nunc non, varius viverra elit.</p>,
        <h3>Insight: Wat is your passion? </h3>,
        <p> Phasellus vitae viverra ante, sit amet lacinia augue. Sed tempus tincidunt purus, ac tempus lectus fringilla elementum. Nunc elementum ligula vel ante ultricies, nec egestas odio convallis. Duis id est scelerisque, fringilla eros sed, feugiat turpis. Vestibulum et sapien laoreet, fringilla leo eu, aliquet augue. Sed pharetra nunc at nisi elementum ultricies. Cras eu nisi turpis. </p>,
        <p> Quisque eget leo sem. Sed turpis dui, consequat nec enim id, pharetra imperdiet orci. Praesent imperdiet vel quam a malesuada. Suspendisse potenti. Integer tempus, dui ut lobortis rhoncus, metus enim suscipit est, non bibendum ante ex in lorem. Nam nec euismod turpis. Cras condimentum sit amet tortor nec cursus. Cras pretium vitae nisi vel vestibulum. Proin fringilla nulla tincidunt, scelerisque ligula eu, dapibus lectus. Nam et porttitor lorem. Fusce vestibulum tempus nisl, id laoreet lacus commodo eu. Aenean vel vulputate arcu, nec hendrerit nisl. Phasellus et lacus faucibus, euismod quam vitae, placerat massa. In et placerat lectus. Maecenas eu tincidunt ex. Suspendisse tristique orci ex. </p>,
        <h3>Questions abounded because I didn't know shit. </h3>,
        <p> Quisque fermentum justo sed consequat fermentum. Cras finibus nisi ac aliquam accumsan. Cras eget rhoncus est. Maecenas elementum nulla et lectus consectetur iaculis eu eget turpis. Integer tincidunt in sapien vel dictum. Aliquam quis arcu sed nisl consequat dictum vel sagittis ex. Sed pellentesque in nisl in rhoncus. Donec in metus ut nibh gravida rutrum eget eget tortor. Mauris ultrices ligula sit amet risus scelerisque viverra. Ut vitae ligula ut nisi aliquet faucibus ac ut lacus. Curabitur vitae nulla eget felis fringilla maximus id a libero.  </p>,
    ]





export {MockObject, MockBlurb, MockPage}