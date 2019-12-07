import React, {useState, useEffect, Suspense} from 'react'
import {usePhysics} from './Physics'
import * as THREE from 'three'
import * as CANNON from 'cannon'
import {toRads} from '../../utils/3d'

import Seseme from '../projects/seseme'

//box only, subsequent bodies will use parameters to construct compound bodies / other shapes
export function SimpleBody({
  shapes = ['box'], //array of shapes (just box, sph, cyl rn)
  shapeParams = [{size: [2,2,2], offset: [0,0,0]}], //matching objects specify size and offset [add rot later] for shapes
  position=[0,0,0], rotation=[0,0,0], visible = true, children
}) {
  const [isSleep, setSleepState] = useState(false)
  const phys = usePhysics({mass: 100}, body => {

    shapes.forEach((shape, i)=>{
        const Shape = shape.charAt(0).toUpperCase() + shape.slice(1)
        console.log(Shape)

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

        } else { //other shapes dont use vec3, just a few nums
          body.addShape(
            new CANNON[Shape](...shapeParams[i].size.map(s=>s) ), 
            shapeParams[i].offset? new CANNON.Vec3(...shapeParams[i].offset.map((v)=>v)) : null
          )
        }
    })


    body.position.set(...position)
    body.quaternion.setFromEuler(...rotation.map((r)=>toRads(r)),'XYZ')
    body.allowSleep = true
    body.onSleep = () => {setSleepState(true)}
  })

  return (
      <group ref = {phys.ref}>
        
        {shapes.map((shape, i)=>{
          console.log(`making a ${shape} with args ${shapeParams[i].size}`)
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