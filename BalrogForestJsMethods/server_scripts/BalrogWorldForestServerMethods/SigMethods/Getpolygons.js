// Renvoie un TABLEAU contenant les noms de toutes les parcelles qui englobent le point (x, z)
// NOTA il faudra penser a faire en sorte que la géometrie soit toujours MultiPolygon sur le geojson
function getPolygonNames(player, x, z) {
    const data = loadFrontierData(player, `${getMcWorld(player)}_ug`)
    if(!data) {return}
    const frontiers = data.features

    let matching_parcels = []

    let points
    

    for (const f of frontiers) {

        let inside = false

        if (f.geometry.type === "Polygon") {

            points = f.geometry.coordinates[0].map(c => ({
                X: Number(c[0]),
                Z: -Number(c[1])
            }));

            inside = isPointInPolygon(x, z, points);

        } else if (f.geometry.type === "MultiPolygon") {

            for (const polygon of f.geometry.coordinates) {

                points = polygon[0].map(c => ({
                    X: Number(c[0]),
                    Z: -Number(c[1])
                }));

                if (isPointInPolygon(x, z, points)) {
                    inside = true;
                    break
                }
            }
        }

        if (inside) {

            let props = f.properties || {};
            let username = (props.owner && props.owner.username)
                ? props.owner.username
                : "Inconnu";

            matching_parcels.push({
                name: props.name1 || "Nom inconnu",
                surface: props.SURF || "Non calculée",
                manager: username,
                forest: props.forest,
                id: props.id || null
            })
        }
    }

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
