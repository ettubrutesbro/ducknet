import React, {useRef, useEffect, useState, useContext} from 'react'
import {useThree, useFrame, extend} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {a, useSpring} from 'react-spring/three'
import {toRads, xyzArray} from '../../utils/3d'

import {WorldFunctions} from '../../App'

import ReactDOM from 'react-dom'

//orbit controls for debug only
extend({OrbitControls})
const Controls = props => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useFrame(()=> {
    ref.current.update()
  })
  return <orbitControls ref = {ref} args = {[camera, gl.domElement]} {...props} />
} 

const defaults = {
    position: [0, 0, 45],
    rotation: [0, 0, 0],
    zoom: 1,
    fov: 25,
    orbit: false,
    //maybe set a really gentle config so the transitions from selection > default
    //aren't as jarring...
}

function Camera({
  projectCamera, 
  useThis = true,
  ...props
}) {
  const {setCamStatus} = useContext(WorldFunctions)

  const ref = useRef()

  const [camdata, setCam, stop] = useSpring(()=>({
    position: defaults.position,
    rotation: defaults.rotation,
    fov: defaults.fov,
  }))
  // Make the camera known to the system
  const { setDefaultCamera } = useThree()

  useEffect(() => {
    if(useThis) void setDefaultCamera(ref.current)
  }, [useThis])


  useEffect(()=>{
    console.log('moving camera')
    const target = xyzArray(projectCamera || defaults)
    stop()
    if(!projectCamera){
      // console.log('no project camera, erasing cam status')
      setCamStatus(null)
    }
    setCam({
      position: target.position,
      rotation: target.rotation,
      fov: target.fov,
      config: target.config,
      onStart: target.onStart,
      onRest: () => {
        console.log('camera completed motion')
        if(target.name) setCamStatus(target.name)
      }
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