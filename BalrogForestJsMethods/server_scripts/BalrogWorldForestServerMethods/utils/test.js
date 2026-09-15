function test22(player) {
    let geo_polygons = getDatPolygonNames(player.x, player.z)

    if (geo_polygons) {
        console.log(geo_polygons)
    } else {
        console.error("Impossible de charger les données NBT : le fichier est introuvable ou illisible.")
    }

    return geo_polygons
}

function loadDatFrontierData() {
    let filePath = getDatFrontierFile()

    // NBTIO.read(filePath) renvoie null si le fichier n'existe pas
    try {
        let nbtData = NBTIO.read(filePath)
        return nbtData
    } catch (e) {
        console.error(`Erreur de lecture NBT sur ${filePath}: ` + e)
        return null
    }
}

function getDatFrontierFile() {
    return `${global.getServerContext().serverDir}/mapfrontiers/frontiers.dat`
}

function getDatPolygonNames(x, z) {
    const frontiersData = loadDatFrontierData()
    if (!frontiersData) return []

    // Accès à la liste NBT 'frontiers'
    const frontiers = frontiersData.frontiers
    if (!frontiers) return []

    let matching_parcels = []

    for (const f of frontiers) {
        // Dans MapFrontiers .dat, la géométrie de vertex est une liste 'vertices'
        if (!f.vertices || f.vertices.length === 0) continue

        // Conversion directe des points NBT {X, Y, Z} en tableau utilisable
        let points = f.vertices.map(v => ({
            X: Number(v.X),
            Z: Number(v.Z)
        }))

        // Verification du point (x, z) dans le polygone
        if (isPointInDatPolygon(x, z, points)) {
            matching_parcels.push({
                name: f.name1 ? String(f.name1) : "Nom inconnu",
                surface: f.name2 ? String(f.name2) : "Non calculée",
                forest: f.forest ? String(f.forest) : null,
                id: f.id ? String(f.id) : null,
                owner: f.owner && f.owner.username ? String(f.owner.username) : "Inconnu"
            })
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