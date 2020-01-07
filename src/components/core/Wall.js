import React, {Suspense, useEffect, useState} from 'react'
import {usePhysics} from './Physics'
import * as CANNON from 'cannon'
import {toRads} from '../../utils/3d'

export function Wall({
  name = 'some wall?', 
  position=[0,0,0], 
  rotation=[0,0,0], 
  size, 
  visible=true
}) {
  const phys = usePhysics({mass: 0}, body => {
    console.log('wall')
    body.addShape(new CANNON.Box(new CANNON.Vec3(...size.map((s)=>s/2)))) //size is only going to be visual until you add it here
    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
    body.name = name
    body.onSleep = () => {}

  }, [...size])

  return (
    <mesh ref = {phys.ref}>
      <boxBufferGeometry attach = 'geometry' args = {size} />
      <meshNormalMaterial attach = 'material' transparent opacity = {0.25} visible={visible} />
    </mesh>
  )
}

export function Enclosure({active}){
  const [cage, modCage] = useState({
    left: true, right: true, ground: true, back: true, front: true,
    // showLeft: true, showRight: true, showGround: true, showBack: true, showFront: false,
    showLeft: false, showRight: false, showGround: false, showBack: false, showFront: false,
    width: 19, height: 12, depth: 7, //TODO: vary these attributes depending on screensize
  }) 

  return(
    <group>
    {cage.ground && active && 
      <Wall name = 'ground' position = {[0, (-cage.height/2)-.5, 0]} rotation = {[-90, 0, 0]} size = {[cage.width,cage.depth,1]} visible = {cage.showGround}/>
    }
    {cage.left && active &&
      <Wall name = 'L' position = {[(cage.width/2)+.5, 0, 0]} rotation = {[0, -90, 0]} size = {[cage.depth,cage.height,1]} visible = {cage.showLeft}/>
    }
    {cage.right && active &&
      <Wall name = 'R' position = {[(-cage.width/2)-.5, 0, 0]} rotation = {[0, 90, 0]} size = {[cage.depth,cage.height,1]} visible = {cage.showRight}/>
    }
    {cage.back && active &&
      <Wall name = 'B' position = {[0, 0, (-cage.depth/2)-.5]} rotation = {[0, 0, 0]} size = {[cage.width,cage.height,1]} visible={cage.showBack} />
    }
    {cage.front && active &&
      <Wall name = 'F' position = {[0, 0, (cage.depth/2)+.5]} rotation = {[0, 0, 0]} size = {[cage.width,cage.height,1]} visible={cage.showFront} />
    }
      <ambientLight intensity = {0.2}/>
      <pointLight position = {[3, 4, 25]} color = {0xffffff} intensity = {0.3} castShadow />
      <pointLight position = {[-10, 10, 8]} color = {0xffffff} intensity = {0.3} castShadow />
    </group>
  )
}