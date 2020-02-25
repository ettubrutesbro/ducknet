import React, {useEffect, useRef, useContext, useState} from 'react'
// import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {animated, useTransition, useSpring, useChain, config} from 'react-spring' 

import {userStore} from '../../App'


function Blurb({
    children,
    visible,
    ...props
}){
    const ref = useRef()
    const contentref = useRef()
    const springRef = useRef()
    const transitionRef = useRef()

    const setB = userStore(store => store.setB)

    const [border, setBorder] = useSpring(()=>({
      transform: 'scaleY(0)',
      ref: springRef,
      config: {duration: 250}
    }))

    const [containerHt, setConHt] = useState(0)

        useEffect(()=>{
      if(visible) {
        setBorder({transform: 'scaleY(1)'})
        if(contentref.current){
          console.log(contentref.current.getBoundingClientRect())
          setConHt(contentref.current.getBoundingClientRect().height)
        }
      }
      else {
        setBorder({transform: 'scaleY(0)'})
        // debugger
      }
    }, [visible])

    const transitions = useTransition(visible? children : [], 
      (item, i, foo) => { return 'item'+i }, 
      {
        ref: transitionRef,
        from: {opacity: 0, transform: 'translateX(-150px)'},
        enter: {opacity: 1, transform: 'translateX(0px)'},
        leave: {opacity: 0, transform: 'translateX(-125px)'},
        config: visible? config.default : config.stiff,
        trail: visible? 40 : 60,
        reset: true,
        onStart: ()=>{ 
          // console.log(contentref.current.getBoundingClientRect().height) 
          // setConHt(contentref.current.getBoundingClientRect().height)
        }
    })

    useEffect(()=>{
        if(ref.current){
            console.log('setting screen coords for line B')
            const rect = ref.current.getBoundingClientRect()
            // console.log(rect.x, rect.y)
            setB({x: rect.x+1, y: rect.y + (rect.height/2)})
        }

    })



    useChain(visible? [springRef, transitionRef] : [transitionRef, springRef], visible? [.925, 1.05] : [0, 0.15])

    return <Container 
      ref = {ref} 
      visible = {visible} 
      height = {containerHt}
      {...props}
    >
      <Flex 
        // ref = {contentref}
        // ref = {self => {
          // console.log(self)
          // if(self) setConHt(self.getBoundingClientRect().height)
        // }}
      >
        {transitions.map(({item, key, props}) => <animated.div key = {key} style = {{...props}} children = {item}/>)}
      </Flex>

      <ShadowContent
        ref = {contentref}
      >
        {children}
      </ShadowContent>

      <LeftBorder 
        style = {border} 
      />
    </Container>
}

const Container = styled.div`
  position: absolute;
  width: 40%;
  // height: 100%;
  height: ${p => p.height}px;
  top: 0; bottom: 0; margin: auto 0;
  right: 0;
  pointer-events: ${p => p.visible? 'auto' : 'none'};
  overflow: hidden;
  padding: 50px 100px 50px 50px;

`

const Flex = styled.div`
  position: relative;
  // height: 100%;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;

`

const LeftBorder = styled(animated.div)`
    transform: scaleY(0);
    position: absolute;
    transform-origin: 50% 50%;
    top:0; left: 0px;
    width: 0px; height: 100%;
    border-right: 2px black solid;
`

const ShadowContent = styled.div`
  visibility: hidden;
`


export default Blurb