/*
    as you set the position / rotation of the cylinder, also
    set the pos/quaternions of the planes inside (relatively ofc)?
*/
const phys = usePhysics({mass: 1000}, body => {
    body.addShape(new CANNON.Cylinder(new CANN))
})