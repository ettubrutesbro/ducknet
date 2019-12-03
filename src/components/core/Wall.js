import React, {Suspense} from 'react'
import {usePhysics} from './Physics'
import * as CANNON from 'cannon'
import {toRads} from '../../utils/3d'

export function Wall({position, rotation, size=[11,11,.5], visible=true}) {
  const ref = usePhysics({mass: 0}, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(...size))) //size is only going to be visual until you add it here
    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
  })
  return (
    <mesh ref = {ref}>
      <boxBufferGeometry attach = 'geometry' args = {size} />
      <meshNormalMaterial attach = 'material' transparent opacity = {0.25} visible={visible} />
    </mesh>
  )
}