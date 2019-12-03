import React, {Fragment} from 'react'
import styled from 'styled-components'

export const Range = (props) => {
    const {label, max, min, step, target, change} = props
    return(
        <RangeRow>
            <h3> {label}: {target} </h3>
            <input 
                type = 'range'
                min = {min}
                max = {max}
                step = {step}
                value = {target}
                onChange = {(e)=> change(e.target.value)}
            />
        </RangeRow>
    )
}

const RangeRow = styled.div`
    display: flex;
    align-items: center;
`