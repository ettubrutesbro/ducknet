import {useTransition} from 'react-spring'
/* 
    both blurb and page have similar-ish useTransition (react-spring)
    hooks which I find confusing, so this is a utility to abstract and shorten
    that code. that way both blurb and page will be shorter and simpler, and 
    



*/


function useListAnimation(
    children, 
    transitionRef, //supply a useRef ref here so this can be part of a chain in the parent

){

}