function test22(player) {
    let geo_polygons = getDatPolygonNames(player.x, player.z)

    if (geo_polygons) {
        console.log(geo_polygons)
    } else {
        console.error("Impossible de charger les données NBT : le fichier est introuvable ou illisible.")
    }

    return geo_polygons
}




