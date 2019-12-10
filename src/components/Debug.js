import React, {Fragment, useContext, useState, useEffect} from 'react'
import {useFrame} from 'react-three-fiber'
import styled from 'styled-components'

import {toRads, toDegs} from '../utils/3d'

import {find} from 'lodash'

//generic container 
//todo: collapsible sections based on tinkergroup
export function Debug(props){
    return <DebugBox> 
        <hr />
        {props.children} 
    </DebugBox>
}

const Range = (props) => {
    const {max, min, step, onChange, name, obj, equation, property} = props

    const updateProperty = e => {
        onChange({
            ...obj,
            [e.target.name]: Number(e.target.value)
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

const OnOffSwitch = (props) => {
    const {onChange, property, obj} = props
    const updateProperty = e => {
        console.log(e.target.value)
        onChange({
            ...obj,
            [e.target.name]: !obj[e.target.name]
        })
    }
    return (
        <InputRow>
            <h4> {property}: {obj[property]} </h4>
            <input 
                type = "checkbox" 
                name = {property}
                checked = {obj[property]}
                onChange = {updateProperty}
            />
        </InputRow>
    )
}

const Group = styled.details`
    border-bottom: 1px solid #898989;
    padding: 8px 15px;
`
const Label = styled.summary`
    cursor: pointer;
    &:focus{
        outline: none;
    }
`
export const TinkerGroup = (props) => {
    const {obj, func, name, open} = props
    return(
        <Group open = {open}>
            <Label> {name} </Label>
            {Object.keys(obj).map((property)=>{
                return typeof obj[property] === 'number'? (
                    <Range
                        key = {obj+property}
                        obj = {obj}
                        property = {property}
                        onChange = {func}
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
                ): typeof obj[property]==='boolean'? (
                    <OnOffSwitch  
                        key = {obj+property}
                        obj = {obj}
                        property = {property}
                        onChange = {func}
                    />
                ) : (<InputRow> {property} doesn't have a matching debug input yet </InputRow>)
            })}
        </Group>
    )
}

const DebugBox = styled.div`
    position: absolute;
    z-index: 65000;
    top: 15px;
    right: 15px;
    width: 280px;
    background: rgba(255,255,255,0.5);
    border: 1px solid #898989;
    border-bottom: none;
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
        default: [-30,30,1],
        zoom: [0,20,1],
        z: [-10,100,1],
        fov: [10, 180, 1],
        rx: [toRads(-180), toRads(180), toRads(1)],
        ry: [toRads(-180), toRads(180), toRads(1)],
        rz: [toRads(-180), toRads(180), toRads(1)],
    },
    cage: {
        default: [3,20,1]
    },
    plrHt: {
        default: [-20,30,.5]
    }
}

const labelEquations = {
    rx: toDegs,
    ry: toDegs,
    rz: toDegs,
    a: (v)=>v+18,
    b: (v)=>v+18,
    c: (v)=>v+18,
    d: (v)=>v+18,
}


