import React from 'react'

export function DumbCube(){
    return <mesh>
        <boxBufferGeometry attach = 'geometry' args = {[1,1,1]} />
        <meshNormalMaterial attach = 'material' />
    </mesh>
}