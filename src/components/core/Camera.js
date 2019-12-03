import React, {useRef, useEffect} from 'react'
import {useThree, useFrame} from 'react-three-fiber'

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
  // useFrame(() => {
  //   ref.current.updateMatrixWorld()
  // })
  return <perspectiveCamera ref={ref} {...props} />
}

export default Camera