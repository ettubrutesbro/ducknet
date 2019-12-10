import React, {useState, useEffect, Suspense} from 'react'
import * as CANNON from 'cannon'
// import {animated, useSpring} from 'react-spring'
import TWEEN from '@tweenjs/tween.js'


import {usePhysics} from './Physics'
import {toRads } from '../../utils/3d'

console.log(TWEEN)

//box only, subsequent bodies will use parameters to construct compound bodies / other shapes
export function Body({
  shapes = ['box'], //array of shapes (just box, sph, cyl rn)
  shapeParams = [{size: [2,2,2], offset: [0,0,0]}], //matching objects specify size and offset [add rot later] for shapes
  position=[0,0,0], rotation=[0,0,0], visible = true, 
  forced={position: null, rotation: null},
  inScene = true, //controls whether usePhys will run again; toggle when no need to render (i.e. it fell out of view)
  children,
}) {

  const [isSleep, setSleepState] = useState(false)

  const phys = usePhysics({mass: 100}, body => {

    shapes.forEach((shape, i)=>{
        const Shape = shape.charAt(0).toUpperCase() + shape.slice(1)

        if(shape === 'box'){
          //Box gets special treatment because cannon defines box size through half-extents
          //(like a radius for a box), and it uses a Vec3
          body.addShape(
            new CANNON[Shape](new CANNON.Vec3(...shapeParams[i].size.map(s=>s/2))),
            shapeParams[i].offset? new CANNON.Vec3(...shapeParams[i].offset.map((v)=>v)) : null
          )
        } else if(shape==='cylinder'){ 
          //cylinder is also v. different - created on diff. axis? [see cannon issue #58]
          let canCyl = new CANNON[Shape](...shapeParams[i].size.map(s => s))
          const quat = new CANNON.Quaternion
          quat.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2)
          const xlation = new CANNON.Vec3(0,0,0)
          canCyl.transformAllPoints(xlation,quat)

          body.addShape(
            canCyl, 
            shapeParams[i].offset? new CANNON.Vec3(...shapeParams[i].offset.map((v)=>v)) : null
          )

        } else { //sphere just uses one number
          body.addShape(
            new CANNON[Shape](...shapeParams[i].size.map(s=>s) ), 
            shapeParams[i].offset? new CANNON.Vec3(...shapeParams[i].offset.map((v)=>v)) : null
          )
        }
    })


    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
    body.allowSleep = true
    body.onSleep = () => {
      console.log('slept')
      setSleepState(true)
    }
  }, [inScene]) //deps doesnt work here?

  useEffect(()=>{
    console.log('body useeffect')

    setSleepState(false)

    if(forced){
      phys.body.wakeUp()
      phys.body.mass = 0
      phys.body.velocity.set(0,0,0)
      phys.body.angularVelocity.set(0,0,0)
      phys.body.updateMassProperties()
      phys.body.allowSleep = false

      const pos = phys.body.position.clone()
      const rot = phys.body.quaternion.clone()
      const targetRot = phys.body.quaternion.clone().setFromEuler(...forced.rotation.map(r=>toRads(r)), 'XYZ')

      const current = {
        x: pos.x,  y: pos.y,  z: pos.z,
        rx: rot.x, ry: rot.y, rz: rot.z, rw: rot.w,
      }
      const newPos = {
        x: forced.position[0], y: forced.position[1], z: forced.position[2],
        rx: targetRot.x, ry: targetRot.y, rz: targetRot.z, rw: targetRot.w,
      }
      phys.body.moveTween = new TWEEN.Tween(current)
        .to(newPos, 300)
        .onUpdate(function(){
          phys.body.position.set(current.x,current.y,current.z)
          phys.body.quaternion.set(current.rx, current.ry, current.rz, current.rw)
        })
        .onComplete(()=>{
          console.log('body done moving')
          phys.body.allowSleep = true
        })
        .start()
    }
    else{
      if(phys.body.moveTween) phys.body.moveTween.stop()
      phys.body.wakeUp()
      phys.body.mass = 100
      phys.body.updateMassProperties()
    }

  }, [forced])

  return (
      <group ref = {phys.ref}>
        
        {shapes.map((shape, i)=>{
          return <mesh key = {i} position = {shapeParams[i].offset || [0,0,0]}>
            {shape === 'box' && <boxGeometry attach = 'geometry' args = {shapeParams[i].size} />}
            {shape === 'cylinder' && <cylinderGeometry 
              attach = 'geometry' args = {shapeParams[i].size}
             />}
            {shape === 'sphere' && <sphereGeometry attach = 'geometry' args = {shapeParams[i].size} />}
           <meshBasicMaterial 
            attach = 'material' 
            color = "#FF0000" 
            visible = {visible}
            transparent
            opacity = {isSleep? 0.3 : 0.15}
          />
          </mesh>
        })}
        
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