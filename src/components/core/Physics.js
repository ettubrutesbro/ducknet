import React, {useState, useEffect, useContext, useRef} from 'react'
import {useFrame} from 'react-three-fiber'
import * as CANNON from 'cannon'
import TWEEN from '@tweenjs/tween.js'

import {WorldFunctions} from '../../App'

const physicsContext = React.createContext()
export function PhysicsProvider({children}){
  const [world] = useState(()=> new CANNON.World())
  useEffect(() => {
    console.log('WORLD:')
    console.log(world)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.allowSleep = true
    world.solver.iterations = 10
    world.gravity.set(0,-20, 0)
  }, [world])
  //world stepper every frame
  useFrame(()=> {
    world.step(1/60)
    TWEEN.update() //kinda dangerous: this is not physics, though tween probably will only deal with it...

  })
  window.world = world

  //world is provided as context for all components
  return <physicsContext.Provider value = {world} children = {children} />
}

//cannon hook for tracking/updating a physics obj
//usePhysics(cannon properties, a function to call on the body created herein, deps????)
export function usePhysics({ ...props}, fn, deps = [], name){

  const worldFuncContext = useContext(WorldFunctions)

  let isSleep
  const ref = useRef()

  //use provided context: will get value (world info) from nearest parent cannonProvider
  const world = useContext(physicsContext) //not known: do i need to have a const context = React.createContext() every time i make a component that uses context...???

  //instantiate body for whoever is using usePhysics
  const [body] = useState(()=> new CANNON.Body(props))
  useEffect(()=>{
    if(body.mass > 0){ 
      console.log(name, 'ADDED')
    }
    fn(body)
    world.addBody(body)
    ref.current.firstRun = true
    return () => world.removeBody(body)
  }, deps)
  
  useFrame(()=>{    
    if(ref.current){ 
        if(body.position.y< -20 && !worldFuncContext.abyss.includes(name)){
          // console.log('admitting', name, 'to abyss')
          worldFuncContext.admitToAbyss([...worldFuncContext.abyss, name])
          if(!worldFuncContext.selected){
            // console.log('rapid undo: reinserting object')
            worldFuncContext.admitToAbyss([])
          }
          return
        }

        if(body.sleepState===2){
          if(!isSleep){
            body.onSleep()
            isSleep = true
          }
          return
        }else{
          if(isSleep && body.sleepState!==2){
            body.onWake()
          }
        }
        //referenced threejs object position set to match corresponding cannon phys object
        ref.current.position.copy(body.position)
        ref.current.quaternion.copy(body.quaternion)

        if(ref.current.firstRun){
          /*
          this prevents a Flash of Unpositioned Model, 
          as three renders one frame of a just-mounted model 
          before the position syncs with the physics body
          unfortunately it also runs for static bodies right now - 
          some kind of booleans could be used, but even dynamic bodies 
          toggle between dynamic / static depending on selection state etc. 
          */
          console.log('first run', body.name)
          ref.current.visible = true
          ref.current.firstRun = false
        }

        // console.log(body.name, ref.current.visible)
    }
  })

  return {ref: ref, body: body}
}
