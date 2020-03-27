/*
    object manifest of all projects;
    simplifies App by creating a single import

    also is a 'stage' to expose which projects
    have which components (i.e. some projects don't need Page)
*/

import {SCObject, SCBlurb, SCPage} from './Scorecard'
import {MockObject, MockBlurb, MockPage} from './MockProject'

const allprojects = {
    Scorecard: {
        object: SCObject,
        blurb: SCBlurb,
        page: SCPage
    },

    MockProject: {
        object: MockObject,
        blurb: MockBlurb,
        page: MockPage
    } 
}

export default allprojects