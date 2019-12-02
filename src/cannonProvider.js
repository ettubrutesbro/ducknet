import React, {useState, useEffect, useContext, useRef} from 'react'
import {useRender} from 'react-three-fiber'
import * as CANNON from 'cannon'
const cannonContext = React.createContext()

export function CannonProvider({children}){
  const [world] = useState(()=> new CANNON.World())
  useEffect(() => {
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 10
    world.gravity.set(0,0,-25)
  }, [world])
  //world stepper every frame
  useRender(()=> world.step(1/60))
  //world is provided as context for all components
  return <cannonContext.Provider value = {world} children = {children} />
}
//cannon hook for tracking/updating a physics obj
//useCannon(a component, a function???, deps????)
export function useCannon({ ...props}, fn, deps = []){
  const ref = useRef()

  //use provided context: will get value (world info) from nearest parent cannonProvider
  const world = useContext(cannonContext) //not known: do i need to have a const context = React.createContext() every time i make a component that uses context...???

  //instantiate body for whoever is using useCannon
  const [body] = useState(()=> new CANNON.Body(props))
  useEffect(()=>{
    fn(body)
    world.addBody(body)
    return () => world.removeBody(body)
  }, deps)
  useRender(()=>{
    if(ref.current){
        //referenced threejs object position set to corresponding cannon phys object
        ref.current.position.copy(body.position)
        ref.current.quaternion.copy(body.quaternion)
    }
  })

  return ref
}
