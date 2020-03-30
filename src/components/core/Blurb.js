import React, {Fragment, useEffect, useRef, useContext, useState} from 'react'
// import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {animated, useTransition, useSpring, useChain, config}  from 'react-spring' 

import {InfoPage} from './Page'

import usePrevious from '../hooks/usePrevious'

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
    useEffect(()=>{
      if(contentref.current) setConHt(contentref.current.getBoundingClientRect().height)
    })

    const ref = useRef()
    const contentref = useRef()
    // const transitionRef = useRef()

    const setB = userStore(store => store.setB)
    const setPageReady = userStore(store => store.setPageReady)

    const [containerHt, setConHt] = useState(0)


    return <Container 
        ref = {ref} 
        visible = {visible} 
        height = {containerHt}
        {...props}
      >
        <Content ref = {contentref}> {children} </Content>
      </Container>
}

const Container = styled.div`
  position: absolute;
  width: 40%;
  height: ${p => p.height}px;
  top: 0; bottom: 0; margin: auto 0;
  right: 0;
  padding: 50px 0 50px 0;
  border: 1px solid red;
`

const Content = styled.div`
  position: relative;
  border: 1px solid green;
  overflow: hidden;
  padding-left: 50px;
  padding-right: 100px;
`


export default Blurb