export const toRads = degs => {
  return degs * (Math.PI / 180)
}

export const toDegs = rads => {
  return rads * (180 / Math.PI)
}

export const deltaQuaternion = (qTo, qFrom) => {
    console.log(qTo)
    console.log(qFrom.inverse())
    // return qTo * qFrom.inverse()
    const ionowtf = {
        // x: qTo.x * qFrom.inverse().x,
        // y: qTo.y * qFrom.inverse().y,
        // z: qTo.z * qFrom.inverse().z,
        // w: qTo.w * qFrom.inverse().w,

        x: getDiff(qTo.x, qFrom.x),
        y: getDiff(qTo.y, qFrom.y),
        z: getDiff(qTo.z, qFrom.z),
        w: getDiff(qTo.w, qFrom.w),
    }

    return (Object.values(ionowtf).reduce((a,b)=> a+b, 0))
}

export const getDiff = (a, b) => (-Math.abs(a)) - b
