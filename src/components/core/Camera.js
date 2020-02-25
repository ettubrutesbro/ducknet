import React, {useRef, useEffect, useState, useContext} from 'react'
import {useThree, useFrame, extend, Dom} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import styled from 'styled-components'

import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import * as meshline from 'threejs-meshline'
// import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry'
// import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial'
// import {Line2} from 'three/examples/jsm/lines/Line2'

import {a, useSpring} from 'react-spring/three'
import {toRads} from '../../utils/3d'

import {userStore} from '../../App'

extend(meshline)

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

  const {lineA, lineB, selected} = userStore(store => ({
    lineA: store.lineA, 
    lineB: store.lineB, 
    selected: store.selected
  }))

  const {cam, setCam, setCameraRef} = useContext(cameraContext)

  //set camera as default
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    void setDefaultCamera(ref.current)
  }, [useThis])


  const aRef = useRef()

  const lineRef = useRef()
  const lineMtlRef = useRef()
  // const fatline = useRef()

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
    ref.current.updateMatrixWorld()
    ref.current.updateProjectionMatrix()

    updateHud(lineA, lineB) //hopefully this isn't expensive; shadowCamera gambit didn't work right...
  })

  // const [dashSpring, setDash] = useSpring(()=>({offset: 0}))
  useEffect(() => {
    if(selected){
    const current = {offset: lineMtlRef.current.dashOffset}
    lineMtlRef.current.offsetTween = new TWEEN.Tween(current)
      .to({offset:-0.5}, 400)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){ lineMtlRef.current.dashOffset = current.offset })
      .onComplete(()=>{})
      .delay(700)
      .start()
    }
    else if(lineMtlRef.current.offsetTween){

      lineMtlRef.current.offsetTween.stop()
      lineMtlRef.current.dashOffset = 0

    }
  }, [selected])

  const updateHud = (a,b) => {
      let v3 = new THREE.Vector3()
      v3.set(
        (b.x / window.innerWidth) * 2 - 1,
        - (b.y / window.innerHeight) * 2 + 1,
        0
      )

      v3.unproject(ref.current)
      v3.sub(ref.current.position).normalize()
      var distance = -ref.current.position.z / v3.z

      const bTo = new THREE.Vector3().copy(ref.current.position).add(v3.multiplyScalar(distance))
      const aTo = a && a.current? new THREE.Vector3().copy(a.current.position) : new THREE.Vector3()

      lineRef.current.geometry.setVertices([ aTo, bTo ])
      lineRef.current.geometry.verticesNeedUpdate = true
  }

  return <React.Fragment> 
    <a.perspectiveCamera 
      ref={ref} 
      position = {springTo.position}
      rotation = {springTo.rotation}
      fov = {springTo.fov}
    />
  {/*
    <group ref = {hudRef} visible = {false}>
      <DumbCube />
    </group>
*/}
    <group>
      <Dom>
        <Spot visible = {selected!==null} />
      </Dom>
    </group>

    
    <mesh ref = {lineRef} 
      renderOrder = {10000}
      visible = {selected!==null}
    >
      <meshLine attach = 'geometry'
        vertices = {[
          new THREE.Vector3(0,0,0),
          new THREE.Vector3(0,0,0)
        ]} 
      />
      <meshLineMaterial
        ref = {lineMtlRef}
        attach = 'material' 
        color = {0x000000} 
        lineWidth = {0.00275} 
        sizeAttenuation = {false}
        depthTest = {false}
        dashArray = {1}
        // dashOffset = {dashSpring.offset}
        dashRatio = {0.5}
      />
    </mesh>

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


const Spot = styled.div`
  visibility: ${p => p.visible? 'visible' : 'hidden'};
  pointer-events: none;
  transition: transform .35s;
  transition-delay: ${p => p.visible? '.4s' : 0};
  transform: scale(${p=> p.visible? 1 : 0});
  position: relative;
  width: 1px;
  height: 1px;
  border: 1px solid red;
  &::before{
    content: '';
    position: absolute;
    transform: translate(-50%,-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid black;
    background: white;
  }
`
