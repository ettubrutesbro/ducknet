import React from 'react'
import {animated} from 'react-spring'
import {userStore} from '../../../App'

const BlurbTitle = () => (<h1 key = 'title'> Scorecard of California children's well-being </h1>)
const Blurb = () => (<p key = 'blurb' >A web tool for exploring children's health, education, and welfare data in California and all its counties, filterable by race and year. Designed and developed for Children Now, a nonprofit that uses it in meetings with local leaders
(government, foundations, nonprofits) to highlight and advocate for children's needs.</p>)
const Button = () => {
    const study = userStore(store => store.study)
    return <button key = 'btn' onClick = {()=> study('scorecard')}> View case study </button>
}

export const SCBlurb = [
    <BlurbTitle key = 'title' />,
    <Blurb key = 'blurb' />,
    <Button key = 'btn' />
]


// export default SCBlurb
