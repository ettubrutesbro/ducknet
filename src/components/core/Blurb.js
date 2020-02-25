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

    const [border, setBorder] = useSpring(()=>({
      transform: 'translate3d(0px,0,0) scaleY(0)',
      ref: borderAnimRef,
      config: {duration: 250}
    }))

    const [pageBG, setPageBG] = useSpring(()=>({
      transform: 'translate3d(-100%,0,0)',
      ref: pageBGAnimRef,
      config: {duration: 1000}
    }))

    const [containerHt, setConHt] = useState(0)

    const previousMode = usePrevious({mode})

    useEffect(()=>{
      console.log('from', previousMode, 'to', mode)
      if(mode === 'expand'){
        /* 
          border needs to be transformed to go to full height
          divide innerHeight by containerHt to get scale for border

          get difference between current border position and target position
        */
        const yScalar = window.innerHeight / containerHt
        const borderGoTo = borderTarget.current.getBoundingClientRect().x - borderRef.current.getBoundingClientRect().x
        console.log('bordergoto', borderGoTo)
        setBorder({
          from: {transform: 'translate3d(0px,0,0) scaleY(0)'},
          to: {transform: `translate3d(${borderGoTo + 4}px,0,0) scaleY(${yScalar})`},
          // translate: `translate3d(${borderGoTo + 4}px,0,0)`,
          // scale: `scaleY(${yScalar})`,
          config: config.default,
          // immediate: false
        })
        setPageBG({transform: 'translate3d(0%,0,0)',})
      }
      else if(mode === 'visible') {
        setBorder({
          transform: `translate3d(0px,0,0) scaleY(1)`,
          // immediate: false,
          // translate: 'translate3d(0px,0,0)', 
          // scale: 'scaleY(1)'
        })
        if(contentref.current) setConHt(contentref.current.getBoundingClientRect().height)
      }
      else if(previousMode && previousMode.mode){
        if(previousMode.mode === 'expand' && mode === 'hidden'){
          setBorder({
            transform: `translate3d(0px,0,0) scaleY(0)`,
            // immediate: true
            // translate: 'translate3d(0px,0,0)',
            // scale: 'scaleY(0)'
          })
          setPageBG({transform: 'translate3d(-100%,0,0)'})
        }
        else if(previousMode.mode === 'visible' && mode === 'hidden'){
          setBorder({
            transform: `translate3d(-100%,0,0) scaleY(0)`,
            // immediate: false
            // translate: 'translate3d(0px,0,0)',
            // scale: 'scaleY(0)'
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
        leave: mode === 'expand'? {opacity: 0, transform: 'translateX(-300px)'}
          : {opacity: 0, transform: 'translateX(-125px)'} //hidden
        , //TODO: more dramatic for mode == expand?
        config: mode==='visible'? config.default : config.stiff,
        trail: mode==='visible'? 40 : 60,
        reset: true,
    })





    useChain(
      mode === 'expand'? [transitionRef, borderAnimRef, pageBGAnimRef]: 
      mode === 'visible'? [borderAnimRef, transitionRef]
      : [transitionRef, borderAnimRef], 

      // mode === 'expand'? [0, 0.2, 0.6]: 
      mode === 'visible'? [.925, 1.05] 
      : [0, 0.2]
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
        />
      </Container>

      <PageBG 
        ref = {borderTarget} 
      >
        <BGSquare 
          style = {pageBG}
        />
      </PageBG>


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
    border-right: 2px black solid;
`

const PageBG = styled(animated.div)` 
  // opacity: 0;
  // background: white;
  pointer-events: none;
  border-left: 2px solid red;
  padding-left: 30px;
  width: 66%; 
  height: 100%; 
  position: absolute;
  top: 0; right: 0;
  box-sizing: border-box;
  overflow: hidden;
`

const BGSquare = styled(animated.div)`
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.5);
  transform: translateX(-100%);
`

export default Blurb