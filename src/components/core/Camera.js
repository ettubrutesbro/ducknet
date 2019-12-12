import React, {useRef, useEffect, useState} from 'react'
import {useThree, useFrame, useRender, extend} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'

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
  ...props
}) {
  const ref = useRef()
  //set attributes according to projects, or back to default
  const [camdata, setCam] = useState(defaults)
  // Make the camera known to the system
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    void setDefaultCamera(ref.current)
    console.log('camera fired useeffect')

    const current = xyzArray(camdata)
    const target = xyzArray(projectCamera || defaults)

    const camTween = new TWEEN.Tween(current)
      .to(target, 550)
      .easing(current.fov < target.fov? TWEEN.Easing.Quintic.Out : TWEEN.Easing.Quadratic.InOut)
      .onUpdate(function(){
        setCam({
          position: [current.x, current.y, current.z],
          rotation: [current.rx, current.ry, current.rz],
          fov: current.fov
        })
      })
      .onComplete(()=>{
        console.log('camera done')
      })
      .start()
    
  }, [projectCamera])
  // Updates per-frame might not help? paul put in updateMatrixWorld
  // but only updProjMatrix works for zoom changes [test for rotation]
  useFrame(() => {
    // ref.current.updateMatrixWorld()
    ref.current.updateProjectionMatrix()
  })

  // console.log(camdata)

  return <React.Fragment> 
    <perspectiveCamera 
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