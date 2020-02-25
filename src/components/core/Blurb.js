import React, {Fragment, useEffect, useRef, useContext, useState} from 'react'
// import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {animated, useTransition, useSpring, useChain, config}  from 'react-spring' 

import {InfoPage} from './Page'

import {usePrevious} from '../../utils/Hooks'

import {userStore} from '../../App'


function Blurb({
    children,
    mode,
    visible,
    ...props
}){
    useEffect(()=>{
      if(ref.current){
          console.log('setting screen coords for line B')
          const rect = ref.current.getBoundingClientRect()
          setB({x: rect.x+1, y: rect.y + (rect.height/2)})
      }
    })

    const ref = useRef()
    const contentref = useRef()
    const borderAnimRef = useRef()
    const transitionRef = useRef()
    const borderRef = useRef()
    const borderTarget = useRef()
    const pageBGAnimRef = useRef()

    const setB = userStore(store => store.setB)
    const setPageReady = userStore(store => store.setPageReady)

    const [border, setBorder] = useSpring(()=>({
      transform: 'translate3d(0px,0,0) scaleY(0)',
      opacity: 1,
      ref: borderAnimRef,
      config: {duration: 250}
    }))
    const [bg, setBG] = useSpring(()=>({
      transform: 'scaleX(0)', opacity: 0,
      ref: pageBGAnimRef
    }))


    const [containerHt, setConHt] = useState(0)

    const previousMode = usePrevious({mode})

    useEffect(()=>{
      console.log('from', previousMode, 'to', mode)
      if(mode === 'expand'){
        setPageReady(true)
        const yScalar = window.innerHeight / containerHt
        const borderGoTo = borderTarget.current.getBoundingClientRect().x - borderRef.current.getBoundingClientRect().x
        console.log('bordergoto', borderGoTo)
        setBorder({
          transform: `translate3d(${borderGoTo}px,0,0) scaleY(${yScalar})`,
          opacity: 1,
          config: config.default,
          reset: false
        })
        setBG({
          from: {transform: 'scaleX(0)', opacity: 0},
          to: {transform: 'scaleX(1)', opacity: 1},
          reset: true,
        })
      }
      else if(mode === 'visible') {
        setPageReady(false)
        setBorder({
          from: {transform: `translate3d(0px,0,0) scaleY(0)`, opacity: 1},
          to: {transform: `translate3d(0px,0,0) scaleY(1)`, opacity: 1},
          reset: true
        })
        if(contentref.current) setConHt(contentref.current.getBoundingClientRect().height)
      }
      else if(previousMode && previousMode.mode){
        if(previousMode.mode === 'expand' && mode === 'hidden'){
          setPageReady(false)
          const yScalar = window.innerHeight / containerHt
          setBorder({
            transform: `translate3d(200px,0,0) scaleY(${yScalar})`,
            opacity: 0,
            reset: false
          })
          setBG({
            transform: 'scaleX(1)', 
            opacity: 0, 
            reset: false,
          })
        }
        else if(previousMode.mode === 'visible' && mode === 'hidden'){
          setBorder({
            transform: `translate3d(0px,0,0) scaleY(0)`,
            opacity: 1,
            reset: false
          }) 
        }
      }
    }, [mode])

    const blurbTransitions = useTransition(mode === 'visible'? children : [], 
      (item, i, foo) => { return 'item'+i }, 
      {
        ref: transitionRef,
        from: {opacity: 0, transform: 'translateX(-150px)'},
        enter: {opacity: 1, transform: 'translateX(0px)'},
        leave: mode === 'expand'? {opacity: 0, transform: 'translateX(-330px)'}
          : {opacity: 0, transform: 'translateX(-125px)'} //hidden
        , //TODO: more dramatic for mode == expand?
        config: mode==='visible'? config.default 
          : previousMode && previousMode.mode === 'expand' ? config.slow 
          : config.stiff,
        trail: mode==='visible'? 40 : 60,
        reset: true,
    })

    useChain(
      mode === 'expand'? [transitionRef, borderAnimRef, pageBGAnimRef]
      : mode === 'visible'? [borderAnimRef, transitionRef, pageBGAnimRef]
      : [transitionRef, borderAnimRef, pageBGAnimRef], 

      mode === 'expand'? [0, 0.2, 0.25] 
      : mode === 'visible'? [.925, 1.05, 1.05] 
      : [0, 0.1, 0.1]
    )

    return <Fragment>
      <Container 
        ref = {ref} 
        visible = {visible} 
        height = {containerHt}
        {...props}
      >
        <Content ref = {contentref}>
          {blurbTransitions.map(({item, key, props}) => <animated.div key = {key} style = {{...props}} children = {item}/>)}
        </Content>

        <LeftBorder 
          ref = {borderRef} 
          style = {border} 
        >
          <BGSquare 
            style = {bg}
          />

        </LeftBorder>
      </Container>

      <PageBG 
        ref = {borderTarget} 
      />


    </Fragment>
}

const Container = styled.div`
  position: absolute;
  width: 40%;
  // height: 100%;
  height: ${p => p.height}px;
  top: 0; bottom: 0; margin: auto 0;
  right: 0;
  pointer-events: ${p => p.visible? 'auto' : 'none'};
  padding: 50px 0 50px 0;

`

const Content = styled.div`
  position: relative;
  overflow: hidden;
  padding-left: 50px;
  padding-right: 100px;
`

const LeftBorder = styled(animated.div)`
    transform: scaleY(0);
    position: absolute;
    transform-origin: 50% 50%;
    top:0; left: 0px;
    width: 0px; height: 100%;
    &::after{
      content: '';
      position: absolute;
      transform-origin: 50% 50%;
      top:0; left: 0px;
      width: 0px; height: 100%;
      border-right: 2px black solid;
    }
    z-index: 10;
`

const BGSquare = styled(animated.div)`
  position: absolute;
  top: 0; left: 0;
  width: 66vw; height: 100%;
  background: white; //do gradient
  opacity: 0;
  transform-origin: 0% 50%;
  pointer-events: none;
`

const PageBG = styled(animated.div)` 
  opacity: 0;
  pointer-events: none;
  border-left: 2px solid red;
  padding-left: 30px;
  width: 66.6%; 
  height: 100%; 
  position: absolute;
  top: 0; right: 0;
  box-sizing: border-box;
`





export default Blurb