import React, {Fragment, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {animated, useTransition, useChain, useSpring, config} from 'react-spring'

import {userStore} from '../../App'

function Page({
    title = 'I need a title',
    children,
    ...props
}){
  const select = userStore(store => store.select)
  const study = userStore(store => store.study)
  const deselect = () => {
    select(null)
    study(null)
  }


  return <Fragment>
    <Title>
      {title}
      <button onClick = {deselect}> Back to Projects </button>
    </Title>
    <InfoPage>
        {children}
    </InfoPage>
  </Fragment>
}


export default Page

function MovingTitle({children, ...props}){

  const titleTransition = useTransition(
    children,
    (item, i) => 'projtitleitem' + i,
    {
      from: {transform: 'translateX(100%)', opacity: 0.75},
      enter: {transform: 'translateX(0%)', opacity: 1},
      leave: {transform: 'translateX(-75%)', opacity: 0},
    }
  )
  return <Title>
    {titleTransition.map((item, key, props)=> 
      <animated.div style = {{...props}} key = {key} children = {item.item} /> 
    )}
  </Title>
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
  top: 0; left: 0;
  width: calc(33.3vw + 2px);
  height: 300px;
  padding: 50px 75px;
  box-sizing: border-box;
  z-index: 1;
`

//component for use by project page
export function ProjectPage({
  children,
  title,
  ...props
}){
  const bodyRef = useRef()
  const titleRef = useRef()

  const pageReady = userStore(store => store.pageReady)

  const [titleTrans, setTitleTrans] = useSpring(()=>({
      ref: titleRef,
      transform: 'translate(0%, -100%)',
      opacity: 0,
  }))

  useEffect(()=>{
    if(pageReady) setTitleTrans({transform: 'translate(0%, 0%)', opacity: 1})
    else setTitleTrans({transform: 'translate(0%, -50%)', opacity: 0})
  }, [pageReady])

  const transitions = useTransition(
    pageReady? children : [], //conditional?
    (item, i) => 'projpageitem' + i,
    {
      ref: bodyRef,
      from: {transform: 'translateX(300px)', opacity: 0},
      enter: {transform: 'translateX(0px)', opacity: 1},
      leave: {transform: 'translateX(100%)', opacity: -0.25},
      config: pageReady? config.default : config.stiff,
      reset: true,
      trail: pageReady? 20 : 0,
      
  })

  useChain(pageReady? [titleRef, bodyRef] : [bodyRef, titleRef], pageReady? [0.75
    ,0.26] : [0,0])

  return <Fragment>
    <Title style = {titleTrans}>
      <h1> {title} </h1>
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