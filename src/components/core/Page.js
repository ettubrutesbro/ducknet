import React, {Fragment, useEffect} from 'react'
import styled from 'styled-components'
import {animated, useTransition} from 'react-spring'

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
const Title = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: calc(33.3vw + 2px);
  height: 300px;
  // background: red;
  outline: 1px solid red;
  padding: 60px;
  box-sizing: border-box;
  z-index: 1;
`

//component for use by project page
export function ProjectPage({
  children,
  ...props
}){
  const pageReady = userStore(store => store.pageReady)
  const transitions = useTransition(
    pageReady? children : [], //conditional?
    (item, i) => 'projpageitem' + i,
    {
      from: {transform: 'translateX(300px)', opacity: 0},
      enter: {transform: 'translateX(0px)', opacity: 1},
      leave: {transform: 'translateX(600px)', opacity: 0},
      reset: true,
      trail: pageReady? 20 : 0
  })

  return <div>
    {transitions.map(({item, key, props}) => {
      return <animated.div key = {key}
        style = {{...props}}
        children = {item}
      />
    })}
  </div>
}