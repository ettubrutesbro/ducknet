import React, {useRef, useEffect, useState} from 'react'
import {useThree, useFrame, useRender, extend} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'

import {a, useSpring} from 'react-spring/three'
import {toRads, xyzArray} from '../../utils/3d'

//orbit controls for debug only
extend({OrbitControls})
const Controls = props => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useRender(()=> {
    ref.current.update()
  })
  return <orbitControls ref = {ref} args = {[camera, gl.domElement]} {...props} />
} 

const defaults = {
    position: [0, 0, 45],
    rotation: [0, 0, 0],
    zoom: 1,
    fov: 25,
    orbit: false
}

function Camera({
  projectCamera, 
  isDefault = true,
  ...props
}) {
  const ref = useRef()
  //set attributes according to projects, or back to default
  const [camdata, setCam] = useSpring(()=>({
    position: defaults.position,
    rotation: defaults.rotation,
    fov: defaults.fov,
    // config: { mass: 1, tension: 120, friction: 32 }
  }))
  // Make the camera known to the system
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    void setDefaultCamera(ref.current)
    console.log('mount: camera set as default')
  }, [isDefault])
  useEffect(()=>{
    console.log('moving camera')
    const target = xyzArray(projectCamera || defaults)
    setCam({
      position: target.position,
      rotation: target.rotation,
      fov: target.fov
    })


    
  }, [projectCamera])
  // Updates per-frame might not help? paul put in updateMatrixWorld
  // but only updProjMatrix works for zoom changes [test for rotation]
  useFrame(() => {
    // ref.current.updateMatrixWorld()
    ref.current.updateProjectionMatrix()
  })

  // console.log(camdata)

  return <React.Fragment> 
    <a.perspectiveCamera 
      ref={ref} 
      position = {camdata.position}
      rotation = {camdata.rotation}
      fov = {camdata.fov}
      // {...props} 
    />
    {props.debugWithOrbit && <Controls/>}
  </React.Fragment>
}

export default Camera