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
  const titleBoxRef = useRef()
  const h1Ref = useRef()
  const [titleCtr, setTitleCenter] = useState(0)

  useEffect(()=>{
    if(h1Ref && h1Ref.current && titleBoxRef && titleBoxRef.current){
      const ctr = (titleBoxRef.current.getBoundingClientRect().width - h1Ref.current.getBoundingClientRect().width) / 2
      setTitleCenter(ctr)
    }
  }, [title])

  return <Fragment>
    <Title ref = {titleBoxRef} ctr = {titleCtr}>
      <Padh1 ref = {h1Ref} ctr = {titleCtr}> {title} </Padh1>
      <LightButton> Back to Projects </LightButton>
    </Title>
    <InfoPage>
    {children}
    </InfoPage>
  </Fragment>
}


export const InfoPage = styled.div`
  padding: 75px 100px 75px 100px;
  box-sizing: border-box;
  width: 66.6%; 
  height: 100%; 
  position: absolute;
  top: 0; right: 0;
  overflow: scroll;
  overflow-x: hidden;
  z-index: 20;

  background: rgba(255,255,255,0.9);
  border-left: 2px black solid;

`
const Title = styled.div`
  position: absolute;
  top: 0; 
  left: ${props => props.ctr - 75}px;
  width: calc(33.3vw + 2px);
  height: 300px;
  padding: 50px 75px;
  box-sizing: border-box;
  z-index: 1;
  opacity: 1;
`
const Padh1 = styled.h1`
  background: white;
  z-index: 5;
`
const LightButton = styled.button`
  margin-top: 25px;
  z-index: 4;
  border: 2px solid black;
  color: black;
  background: white;
`
