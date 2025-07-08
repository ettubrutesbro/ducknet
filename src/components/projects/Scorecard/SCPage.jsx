
import React from 'react'


export const SCPage = () => {
    return(
        <div key = 'fuckyou'>
            <h1> Fuck you </h1>
            {[0,0,0,0,0,0,0].map((c,i)=>{
                return <p key = {i}> hi </p>
            })}
        </div>
    )
}