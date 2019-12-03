import React, {useEffect, Suspense} from 'react'
import {usePhysics} from './Physics'
import * as CANNON from 'cannon'
import {toRads} from '../../utils/3d'

import Seseme from '../projects/seseme'

export function Body({position=[0,0,0], rotation=[0,0,0], visible = true} ) {
  const ref = usePhysics({mass: 1000}, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(1,1,1)))
    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
    body.allowSleep = true
  })
  return (
    <mesh ref = {ref}>
      <boxGeometry attach = 'geometry' args = {[2,2,2]} />
      <meshNormalMaterial attach = 'material' color = "#FF0000" visible = {visible}/>
    </mesh>
  )
}
//box only, subsequent bodies will use parameters to construct compound bodies / other shapes
export function SimpleBody({size = [2,2,2], position=[0,0,0], rotation=[0,0,0], visible = true, children} ) {
  const ref = usePhysics({mass: 1000}, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(...size.map((s)=>s/2))))
    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
    body.allowSleep = true
  })
  return (
      <group ref = {ref}>
        <mesh>
        <boxGeometry attach = 'geometry' args = {size} />
        <meshBasicMaterial 
          attach = 'material' 
          color = "#FF0000" 
          visible = {visible}
          transparent
          opacity = {0.3}
        />
        </mesh>
        {children}
      
      </group>
  )
}

export const LoadingProject = (props) => {
  useEffect(()=>{
    return () => {
      //insert some callback to let app know one model is done
      console.log(`${props.name} loaded`)
    }
  })
  return <mesh> <sphereGeometry attach = 'geometry' /> </mesh>
}