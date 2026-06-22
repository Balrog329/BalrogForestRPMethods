// Renvoie un TABLEAU contenant les noms de toutes les parcelles qui englobent le point (x, z)
function getPolygonNames(player, x, z) {

    const data = loadFrontierData(player, `${getMcWorld(player)}_frontiers`)
    const frontiers = data.frontiers

    // 1. On crée un tableau vide pour stocker les résultats
    let matching_parcels = []

    for (const f of frontiers) {

        let points = []
        f.vertices.forEach(v => {
            points.push({
                X: Number(v.X),
                Z: Number(v.Z)
            })
        })

        if (isPointInPolygon(x, z, points)) {
            console.info(`>>> Point trouvé dans ${f.name1}`)
            // 2. Au lieu de faire un return, on AJOUTE le nom au tableau
            matching_parcels.push({
                name: f.name1,
                surface: f.name2,
                manager: f.owner ? f.owner.username : "Inconnu",
            })
        }
    }

    // 3. Une fois la boucle finie, on vérifie si on a trouvé quelque chose
    if (matching_parcels.length > 0) {
        return matching_parcels // Renvoie le tableau (ex: ["III.5", "Zone_Test"])
    }

    return []
}



function isPointInPolygon(x, z, points) {
    let inside = false;
    let num_points = points.length;
    let j = num_points - 1;

    for (let i = 0; i < num_points; i++) {
        let xi = points[i].X;
        let zi = points[i].Z;
        let xj = points[j].X;
        let zj = points[j].Z;

        if (zi !== zj) {
            let intersect = ((zi > z) != (zj > z)) &&
                            (x < (xj - xi) * (z - zi) / (zj - zi) + xi);

            if (intersect) {
                inside = !inside;
            }
        }
        j = i;
    }

    return inside;
}
