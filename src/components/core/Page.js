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
  
  return <Fragment>
    <Title>
      <Padh1> {title} </Padh1>
      <LightButton> Back to Projects </LightButton>
    </Title>
    <InfoPage>
    {children}
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
