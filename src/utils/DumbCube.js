import React from 'react'

export function DumbCube(ref, props){
    return <mesh {...props}>
        <boxBufferGeometry attach = 'geometry' args = {[1,1,1]} />
        <meshNormalMaterial attach = 'material' />
    </mesh>
}