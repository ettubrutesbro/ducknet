import React, {Fragment} from 'react'
import styled from 'styled-components'
import {toRads, toDegs} from '../utils/3d'

export const Range = (props) => {
    const {max, min, step, change, name, obj, equation, property} = props

    const updateProperty = e => {
        change({
            ...obj,
            [e.target.name]: e.target.value
        })
    }

    return(
        <InputRow>
            <h4> {property}: {equation? equation(obj[property]).toFixed(1) : obj[property]} </h4>
            <input 
                name = {property}
                type = 'range'
                min = {min}
                max = {max}
                step = {step}
                value = {obj[property]}
                onChange = {updateProperty}
            />
        </InputRow>
    )
}

//generic container 
export const Debug = (props) => {
    return <DebugBox> {props.children} </DebugBox>
}

export const TinkerGroup = (props) => {
    const {obj, func, name} = props
    return(
        <Fragment>
            {Object.keys(obj).map((property)=>{
                return ( //if obj[property] is a number...
                    <Range
                        key = {obj+property}
                        obj = {obj}
                        property = {property}
                        change = {func}
                        min = {defRng[name][property]? defRng[name][property][0] 
                            : defRng[name]? defRng[name].default[0] 
                            : 0
                        }
                        max = {defRng[name][property]? defRng[name][property][1] 
                            : defRng[name]? defRng[name].default[1] 
                            : 10}
                        step = {defRng[name][property]? defRng[name][property][2] 
                            : defRng[name]? defRng[name].default[2] 
                            : 1}
                        equation = {labelEquations[property] || null}
                    /> 
                )
            })}
        </Fragment>
    )
}

const DebugBox = styled.div`
    position: absolute;
    z-index: 65000;
    top: 15px;
    right: 15px;
    padding: 15px;
    width: 280px;
`

const InputRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
`
const defRng = {
    // per object with debuggable state values, 
    // provide per-value default min/max/step
    cam: {
        default: [-20,20,.25],
        zoom: [0,20,1],
        rx: [toRads(-180), toRads(180), toRads(1)],
        ry: [toRads(-180), toRads(180), toRads(1)],
        rz: [toRads(-180), toRads(180), toRads(1)],
    }
}

const labelEquations = {
    rx: toDegs,
    ry: toDegs,
    rz: toDegs,
}

