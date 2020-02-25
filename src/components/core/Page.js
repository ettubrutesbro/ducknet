import React, {useEffect} from 'react'
import styled from 'styled-components'
import {animated} from 'react-spring'

function Page({
    children,
    ...props
}){
    return <InfoPage>
        {children}
    </InfoPage>
}

export const InfoPage = styled.div`
  border-left: 2px solid red;
  padding-left: 30px;
  width: 66%; 
  height: 100%; 
  position: absolute;
  top: 0; right: 0;
`

const LeftBorder = styled.div`

`