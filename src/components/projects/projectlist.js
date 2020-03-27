/*
    object manifest of all projects;
    simplifies App by creating a single import

    also is a 'stage' to expose which projects
    have which components (i.e. some projects don't need Page)
*/

import {SCObject, SCBlurb, SCPage}

const allprojects = {
    Scorecard: {
        object: SCObject,
        blurb: SCBlurb,
        page: SCPage
    } 
}

export default allprojects