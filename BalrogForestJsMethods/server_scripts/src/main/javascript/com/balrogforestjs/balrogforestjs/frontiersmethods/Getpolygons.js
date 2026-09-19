
function getDatFrontierFile() {
    return `${global.getServerContext().serverDir}/mapfrontiers/frontiers.dat`
}

function getDatPolygonNames(x, z) {

    // Accès à la liste NBT 'frontiers'
    const frontiers = global.frontiers.frontiers
    if (!frontiers) return []

    let matching_parcels = []

    for (const f of frontiers) {
        // Dans MapFrontiers .dat, la géométrie de vertex est une liste 'vertices'
        if (!f.vertices || f.vertices.length === 0) continue

        // Conversion directe des points NBT {X, Y, Z} en tableau utilisable pour le calcul
        let points = f.vertices.map(v => ({
            X: Number(v.X),
            Z: Number(v.Z)
        }))

        // Vérification du point (x, z) dans le polygone
        if (isPointInDatPolygon(x, z, points)) {
            // On renvoie directement TOUTE la donnée brute de la frontière sans reconstruire l'objet
            matching_parcels.push(f)
        }
    }

    return matching_parcels
}

function isPointInDatPolygon(x, z, points) {
    let inside = false
    let num_points = points.length
    let j = num_points - 1

    for (let i = 0; i < num_points; i++) {
        let xi = points[i].X
        let zi = points[i].Z
        let xj = points[j].X
        let zj = points[j].Z

        if (zi !== zj) {
            let intersect = ((zi > z) !== (zj > z)) &&
                (x < (xj - xi) * (z - zi) / (zj - zi) + xi)

            if (intersect) {
                inside = !inside
            }
        }
        j = i
    }

    return inside
}
