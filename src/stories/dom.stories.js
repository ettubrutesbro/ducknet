import React, {Fragment, useEffect, Suspense} from 'react'
import {withKnobs, text, boolean, number} from '@storybook/addon-knobs'
import styled from 'styled-components'

import Blurb from '../components/core/Blurb'
import Page from '../components/core/Page'

import bogan from 'boganipsum'

export default {
    title: 'DOM things',
    decorators: [withKnobs]
}

export const page = () => {

    return(
        <Page title = 'hello'>
           {[0,1,2,3,4,5].map(()=>{
            return (<Fragment>
                <h2> {bogan({paragraphs: 1, sentenceMin: 1, sentenceMax: 1})} </h2>
                <p> {bogan({paragraphs: 1})} </p>

            </Fragment>)
           })}
        </Page>
    )
}

export const blurb = () => {

    return(
        <Blurb>
            <h1> Title </h1>
            <p> Hello </p>
            <button> Fuck you </button>
        </Blurb>
    )
}