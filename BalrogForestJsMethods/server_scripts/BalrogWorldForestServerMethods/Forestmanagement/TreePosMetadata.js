global.resolveForestNameByPos = function(x, z) {
    let name = getPolygonNames(x, z)[0]
    if (!name) {return}
    return name.forest
}

global.resolveParcelNameByPos = function (x, z) {
    let name = String(getPolygonNames(x, z)[0].name).split(".")[0]
    if (!name) {return}
    return name
}

global.resolveSubParcelByPos = function (x, z) {
    let name = String(getPolygonNames(x, z)[0].name).split(".")[1]
    if (!name) {return}
    return name
}

global.resolveParcelSurfaceByPos = function (x, z) {
    let name = String(getPolygonNames(x, z)[0].surface)
    if (!name) {return}
    return name
}