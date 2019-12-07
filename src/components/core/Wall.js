import React, {Suspense, useEffect, useState} from 'react'
import {usePhysics} from './Physics'
import * as CANNON from 'cannon'
import {toRads} from '../../utils/3d'

export function Wall({position=[0,0,0], rotation=[0,0,0], size=[11,11,.5], visible=true}) {
  const phys = usePhysics({mass: 0}, body => {
    body.addShape(new CANNON.Box(new CANNON.Vec3(...size.map((s)=>s/2)))) //size is only going to be visual until you add it here
    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
    body.onSleep = () => {}
  }, [size])

  return (
    <mesh ref = {phys.ref}>
      <boxBufferGeometry attach = 'geometry' args = {size} />
      <meshNormalMaterial attach = 'material' transparent opacity = {0.25} visible={visible} />
    </mesh>
  )
}

export function Enclosure({mode}){
  const [cage, modCage] = useState({
    left: true, right: true, ground: true, back: true, front: true,
    showLeft: false, showRight: false, showGround: true, showBack: true, showFront: false,
    width: 19, height: 12, depth: 7, //TODO: vary these attributes depending on screensize
  }) 

  return(
    <React.Fragment>
    {cage.ground && 
      <Wall position = {[0, (-cage.height/2)-.5, 0]} rotation = {[-90, 0, 0]} size = {[cage.width,cage.depth,1]} visible = {cage.showGround}/>
    }
    {cage.left &&
      <Wall position = {[(cage.width/2)+.5, 0, 0]} rotation = {[0, -90, 0]} size = {[cage.depth,cage.height,1]} visible = {cage.showLeft}/>
    }
    {cage.right &&
      <Wall position = {[(-cage.width/2)-.5, 0, 0]} rotation = {[0, 90, 0]} size = {[cage.depth,cage.height,1]} visible = {cage.showRight}/>
    }
    {cage.back &&
      <Wall position = {[0, 0, (-cage.depth/2)-.5]} rotation = {[0, 0, 0]} size = {[cage.width,cage.height,1]} visible={cage.showBack} />
    }
    {cage.front &&
      <Wall position = {[0, 0, (cage.depth/2)+.5]} rotation = {[0, 0, 0]} size = {[cage.width,cage.height,1]} visible={cage.showFront} />
    }
    </React.Fragment>
  )
}