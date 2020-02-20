import React, {useEffect, useRef, useContext} from 'react'
// import ReactDOM from 'react-dom'
import styled from 'styled-components'

import {userStore} from '../../App'


function Blurb({
    children,
    ...props
}){
    const ref = useRef()
    const setB = userStore(store => store.setB)

    useEffect(()=>{
        if(ref.current){
            console.log('setting screen coords for line B')
            const rect = ref.current.getBoundingClientRect()
            // console.log(rect.x, rect.y)
            setB({x: rect.x+1, y: rect.y + (rect.height/2)})
        }

    })

    return <Container ref = {ref}>
        {children}
    </Container>
}

const Container = styled.div`
  position: absolute;
  // border: 1px solid red;
  border-left: 2px solid black;
  padding: 50px;
  width: 40%;
  height: 500px;
  top: 0; bottom: 0; margin: auto 0;
  right: 0;
`

export default Blurb