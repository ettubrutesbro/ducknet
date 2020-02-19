
import React from 'react'
import bogan from 'boganipsum'

export const SCPage = () => {
    return(
        <React.Fragment>
            <h1> Fuck you </h1>
            {bogan({paragraphs: 10})}
        </React.Fragment>
    )
}