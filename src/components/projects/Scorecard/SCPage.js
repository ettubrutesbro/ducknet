
import React from 'react'
import bogan from 'boganipsum'

export const SCPage = () => {
    return(
        <div key = 'fuckyou'>
            <h1> Fuck you </h1>
            {[0,0,0,0,0,0,0].map((c,i)=>{
                return <p key = {i}> {bogan({paragraphs: 1})} </p>
            })}
        </div>
    )
}