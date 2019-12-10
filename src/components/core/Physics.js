import React, {useState, useEffect, useContext, useRef} from 'react'
import {useRender} from 'react-three-fiber'
import * as CANNON from 'cannon'
import TWEEN from '@tweenjs/tween.js'
const physicsContext = React.createContext()

export function PhysicsProvider({children}){
  const [world] = useState(()=> new CANNON.World())
  useEffect(() => {
    world.broadphase = new CANNON.NaiveBroadphase()
    world.allowSleep = true
    world.solver.iterations = 10
    world.gravity.set(0,-20, 0)
  }, [world])
  //world stepper every frame
  useRender(()=> {
    world.step(1/60)
    TWEEN.update()

  })
  //world is provided as context for all components
  return <physicsContext.Provider value = {world} children = {children} />
}

//cannon hook for tracking/updating a physics obj
//usePhysics(cannon properties, a function to call on the body created herein, deps????)
export function usePhysics({ ...props}, fn, deps = []){
  let isSleep
  const ref = useRef()

  //use provided context: will get value (world info) from nearest parent cannonProvider
  const world = useContext(physicsContext) //not known: do i need to have a const context = React.createContext() every time i make a component that uses context...???

  //instantiate body for whoever is using usePhysics
  const [body] = useState(()=> new CANNON.Body(props))
  useEffect(()=>{
    if(body.mass > 0){ 
      console.log('usePhysics useEffect fired for dynamic body')
      console.log(deps)
    }
    fn(body)
    world.addBody(body)
    return () => world.removeBody(body)
  }, deps)
  
  useRender(()=>{    
    if(ref.current){ 
        if(body.sleepState===2){
          if(!isSleep){
            body.onSleep()
            isSleep = true
          }
          return 
        }
        //referenced threejs object position set to corresponding cannon phys object
        ref.current.position.copy(body.position)
        ref.current.quaternion.copy(body.quaternion)
    }
  })

  return {ref: ref, body: body}
}
