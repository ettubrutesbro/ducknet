import React, {Fragment, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {animated, useTransition, useChain, useSpring, config} from 'react-spring'

import {userStore} from '../../App'

//component for use by project page
export default function ProjectPage({
  children,
  title,
  ...props
}){
  const bodyAnimRef = useRef()
  const titleAnimRef = useRef()
  const btnAnimRef = useRef()
  const h1Ref = useRef()
  const titleBoxRef = useRef()

  const pageReady = userStore(store => store.pageReady)
  const [titleCtr, setTitleCenter] = useState(0)

  const [titleTrans, setTitleTrans] = useSpring(()=>({
      ref: titleAnimRef,
      transform: 'translate(0%, -50%)',
      opacity: 0,
  }))

  const [btnTrans, setButtonTrans] = useSpring(()=>({
      ref: btnAnimRef,
      transform: 'translate(0%, -100%)',
      opacity: 0,
  }))

  useEffect(()=>{
    if(pageReady){
      setTitleTrans({transform: 'translate(0%, 0%)', opacity: 1})
      setButtonTrans({transform: 'translate(0%, 0%)', opacity: 1})
    }
    else{
      setTitleTrans({transform: 'translate(0%, -50%)', opacity: 0})
      setButtonTrans({transform: 'translate(0%, -100%)', opacity: 0})
    }
  }, [pageReady])

  useEffect(()=>{
    if(h1Ref && h1Ref.current && titleBoxRef && titleBoxRef.current){
      const ctr = (titleBoxRef.current.getBoundingClientRect().width - h1Ref.current.getBoundingClientRect().width) / 2
      setTitleCenter(ctr)
    }
  }, [title, pageReady])

  const transitions = useTransition(
    pageReady? children : [], //conditional?
    (item, i) => 'projpageitem' + i,
    {
      ref: bodyAnimRef,
      from: {transform: 'translateX(300px)', opacity: 0},
      enter: {transform: 'translateX(0px)', opacity: 1},
      leave: {transform: 'translateX(100%)', opacity: -0.25},
      config: pageReady? config.default : config.stiff,
      reset: true,
      trail: pageReady? 20 : 0,
      
  })

  useChain(pageReady? [titleAnimRef, bodyAnimRef, btnAnimRef] : [bodyAnimRef, titleAnimRef, btnAnimRef], pageReady? [0.75
    ,.26, 0.79] : [0,0.025,0])

  return <Fragment>
    <Title ref = {titleBoxRef} style = {titleTrans} ctr = {titleCtr}>
      <Padh1 ref = {h1Ref} ctr = {titleCtr}> {title} </Padh1>
      <LightButton style = {btnTrans}> Back to Projects </LightButton>
    </Title>
    <InfoPage>
    {transitions.map(({item, key, props}) => {
      return <animated.div key = {key}
        style = {{...props}}
        children = {item}
      />
    })}
    </InfoPage>
  </Fragment>
}


export const InfoPage = styled.div`
  pointer-events: none;
  padding: 75px 100px 75px 100px;
  box-sizing: border-box;
  width: 66.6%; 
  height: 100%; 
  position: absolute;
  top: 0; right: 0;
  overflow: scroll;
  overflow-x: hidden;
  z-index: 20;
`
const Title = styled(animated.div)`
  position: absolute;
  top: 0; left: ${props => props.ctr - 75}px;
  width: calc(33.3vw + 2px);
  height: 300px;
  padding: 50px 75px;
  box-sizing: border-box;
  z-index: 1;
  opacity: 0;
`
const Padh1 = styled.h1`
  background: white;
  z-index: 5;
`
const LightButton = styled(animated.button)`
  margin-top: 25px;
  z-index: 4;
  border: 2px solid black;
  color: black;
  background: white;
`
