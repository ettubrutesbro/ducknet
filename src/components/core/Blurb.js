import React, {useEffect, useRef, useContext} from 'react'
// import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {animated, useTransition} from 'react-spring' 

import {userStore} from '../../App'


function Blurb({
    children,
    ...props
}){
    const ref = useRef()
    const setB = userStore(store => store.setB)

    const transitions = useTransition(children, item => item.key, 
      { 

        
        from: {transform: 'translate3d(-25%,0,0)', opacity: 0}, 
        enter: { transform: 'translate3d(0%,0,0)', opacity: 1},
        leave: { transform: 'translate3d(-25%,0,0)', opacity: 0},
        config: {duration: 250},
        trail: 50,
      }
    )

    useEffect(()=>{
        if(ref.current){
            console.log('setting screen coords for line B')
            const rect = ref.current.getBoundingClientRect()
            // console.log(rect.x, rect.y)
            setB({x: rect.x+1, y: rect.y + (rect.height/2)})
        }

    })
    return <Container ref = {ref} {...props}>

        {transitions.map(({item, props, key}) => 
          <animated.div key = {key} style = {props}> {item} </animated.div>)}
        {
          //children
        }
    </Container>
}

const Container = styled.div`
  position: absolute;
  // border: 1px solid red;
  // border-left: 2px solid black;
  padding: 50px;
  width: 40%;
  height: 500px;
  top: 0; bottom: 0; margin: auto 0;
  right: 0;
  pointer-events: ${p => p.visible? 'auto' : 'none'};

  overflow: hidden;

  &::after{
    content: '';
    position: absolute;
    transform: scaleY(${p => p.visible? 1 : 0});
    transition: transform .375s;
    transition-delay: ${p => p.visible? '1s' : 0};
    transform-origin: 50% 50%;
    top:0; left: 0px;
    width: 0px; height: 100%;
    border-right: 2px black solid;

  }
`

export default Blurb