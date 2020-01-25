import React, {useRef, useEffect, useState, useContext} from 'react'
import {useThree, useFrame, useRender, extend} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {a, useSpring} from 'react-spring/three'
import {toRads, xyzArray} from '../../utils/3d'

// import {WorldFunctions} from '../../App'
import {CamContext} from '../PreviewCanvas'

import ReactDOM from 'react-dom'

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
    fov: 25,
    //maybe set a really gentle config so the transitions from selection > default
    //aren't as jarring...
}


function Camera({
  // projectCamera, 
  useThis = true,
  ...props
}) {

  //set camera as default
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    void setDefaultCamera(ref.current)
  }, [useThis])

  

  const {cam, setCam} = useContext(CamContext)

  const [data, setSpring, stop] = useSpring(()=>({
    position: defaults.position,
    rotation: defaults.rotation,
    fov: defaults.fov,
  }))




  useEffect(()=>{
    console.log('moving camera')
    stop()
    if(!cam) setSpring(defaults)
    else setSpring(cam)
  }, [cam])

  // Updates per-frame might not help? example used updateMatrixWorld
  // but only updProjMatrix works for zoom changes [test for rotation]
  useFrame(() => {
    // ref.current.updateMatrixWorld()
    ref.current.updateProjectionMatrix()
  })


  return <React.Fragment> 
    <a.perspectiveCamera 
      ref={ref} 
      position = {data.position}
      rotation = {data.rotation}
      fov = {data.fov}
      // {...props} 
    />
    {props.debugWithOrbit && <Controls/>}
  </React.Fragment>
}

export default Camera

/*
  Debug cameras for adjusting ProjectCameras, orbiting, and checking presets
*/

export function AdjustCamera({
  useThis = false,
  projectCamera,
  domNode, //DOM node where the controls'll be rendered into
  offsets, 
  ...props
}){
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  const [attrs, setAttrs] = useState(defaults)
  useEffect(() => {
    if(useThis){
      console.log(`adjustcam activated, ${projectCamera}`)
      void setDefaultCamera(ref.current)
    }
  }, [useThis])

  useEffect(()=>{
    if(projectCamera){
      setAttrs(projectCamera)
    }
    else setAttrs(defaults)
  }, [projectCamera, useThis])
  // const {setCamStatus} = useContext(WorldFunctions)

  useEffect(()=>{
    if(offsets && projectCamera){
      setAttrs({
        ...projectCamera,
        position: [
          projectCamera.position[0] + offsets.position[0],
          projectCamera.position[1] + offsets.position[1],
          projectCamera.position[2] + offsets.position[2],
        ],
        rotation: [
          projectCamera.rotation[0] + offsets.rotation[0],
          projectCamera.rotation[1] + offsets.rotation[1],
          projectCamera.rotation[2] + offsets.rotation[2],
        ]
      })
    }
  }, [offsets])

  useFrame(() => {
    ref.current.updateMatrixWorld()
    if(useThis) ref.current.updateProjectionMatrix()
  })

  return <perspectiveCamera 
    ref = {ref}
    position = {attrs.position}
    rotation = {attrs.rotation}
    fov = {attrs.fov}
  />
}

