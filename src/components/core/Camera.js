import React, {useRef, useEffect, useState, useContext} from 'react'
import {useThree, useFrame, extend} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {a, useSpring} from 'react-spring/three'
import {toRads} from '../../utils/3d'

import ReactDOM from 'react-dom'

export const cameraContext = React.createContext()
export function CameraProvider({debugCamera, children}){
  const [cam, setCam] = useState(null)
  const [cameraRef, setCameraRef] = useState(null)
  useEffect(()=>{
    //if prop debugCamera is provided, use it to override (without spring) camera attributes
    if(debugCamera) setCam(debugCamera)
  }, [debugCamera])
  return (
  <cameraContext.Provider 
    value = {{
      cam: cam, 
      setCam: setCam,
      cameraRef: cameraRef,
      setCameraRef: setCameraRef
    }}
  >
    <Camera /> 
    {children}
  </cameraContext.Provider>
  )
}

export const defaults = {
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

  const {cam, setCam, setCameraRef} = useContext(cameraContext)

  //set camera as default
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    void setDefaultCamera(ref.current)
    setCameraRef(ref.current)
  }, [useThis])

  



  const [springTo, setSpring, stop] = useSpring(()=>({
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

  useFrame(() => {
    //may need upd. matrix world...
    ref.current.updateProjectionMatrix()
  })

  return <React.Fragment> 
    <a.perspectiveCamera 
      ref={ref} 
      position = {springTo.position}
      rotation = {springTo.rotation}
      fov = {springTo.fov}
    />
  </React.Fragment>
}

export default Camera


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
