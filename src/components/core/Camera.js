import React, {useRef, useEffect, useState, useContext} from 'react'
import {useThree, useFrame, extend, Dom} from 'react-three-fiber'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry'
import {Line2} from 'three/examples/jsm/lines/Line2'

import {a, useSpring} from 'react-spring/three'
import {toRads} from '../../utils/3d'
import {DumbCube} from '../../utils/DumbCube'

import {userStore} from '../../App'
import * as meshline from 'threejs-meshline'

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

  const {lineA, lineB} = userStore(store => ({lineA: store.lineA, lineB: store.lineB}))
  const {cam, setCam, setCameraRef} = useContext(cameraContext)

  //set camera as default
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  useEffect(() => {
    void setDefaultCamera(ref.current)
  }, [useThis])


  const lineRef = useRef()
  const lineRef2 = useRef()

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

  useEffect(()=>{
    console.log(lineB)
  }, [lineB])

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

      const aTo = a && a.current? new THREE.Vector3().copy(a.current.position) : new THREE.Vector3()
      const bTo = new THREE.Vector3().copy(ref.current.position).add(v3.multiplyScalar(distance))


      lineRef.current.geometry.vertices[0] = aTo
      lineRef.current.geometry.vertices[1] = bTo
      lineRef.current.geometry.verticesNeedUpdate = true

      lineRef2.current.geometry.setVertices([ aTo, bTo ])
      lineRef2.current.geometry.verticesNeedUpdate = true
      // console.log(aTo, bTo)
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

    <group ref = {aRef} visible = {false}>
      <Dom>
        A
      </Dom>
    </group>
*/}
    <line ref = {lineRef} visible = {false} >
      <geometry attach = 'geometry' 
        vertices = {['foo','bar'].map((v,i)=>new THREE.Vector3(0,i*100,0))} 
      />
      <lineBasicMaterial attach = 'material' color = {0xff0000} width = {0.1} />
    </line>
    
    <mesh ref = {lineRef2} renderOrder = {10000}>
      <meshLine attach = 'geometry'
        vertices = {[
          new THREE.Vector3(0,0,0),
          new THREE.Vector3(0,2,0)
        ]} 
        // onUpdate = {self => console.log(self)}
      />
      <meshLineMaterial attach = 'material' color = {0x000000} lineWidth = {0.003} 
        sizeAttenuation = {false}
        depthTest = {false}
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
