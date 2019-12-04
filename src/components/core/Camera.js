import React, {useRef, useEffect} from 'react'
import {useThree, useFrame, useRender, extend} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//orbit controls for debug only
extend({OrbitControls})
const Controls = props => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useRender(()=> {
    ref.current.update()
    // console.log('orbcontrols')
    // console.log(camera)
  })
  return <orbitControls ref = {ref} args = {[camera, gl.domElement]} {...props} />
} 

function Camera(props) {
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  // Make the camera known to the system
  useEffect(() => {
    void setDefaultCamera(ref.current)
    console.log('useeffect')
  }, [])
  // Updates per-frame might not help? paul put in updateMatrixWorld
  // but only updProjMatrix works for zoom changes [test for rotation]
  useFrame(() => {
    // console.log('camera')
    // console.log(ref.current)
    // ref.current.updateMatrixWorld()
    ref.current.updateProjectionMatrix()
  })
  return <React.Fragment> 
    <perspectiveCamera ref={ref} {...props} />
    {props.debugWithOrbit && <Controls/>}
  </React.Fragment>
}

export default Camera