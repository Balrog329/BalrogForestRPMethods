

function measureTree(player, tree_data, pos) {
    let tree_config_data = loadConfigData(player, "speciesdata")[tree_data.tree_species]

    let id = `${getTreePositionStr(tree_data)}_${tree_data.volume_total}`

    let tree_logs_segments = getTreeLogSegments(tree_data, tree_config_data)
  
    let height = tree_logs_segments.length
    if (height == 0) {return}

    let quality = 0
    if (player.level.getBlock(tree_data.x, tree_data.y, tree_data.z).properties.fertility == 0) {
        quality = 2 // bois sec
    }
    else {
        quality = tree_config_data.default_quality
    }

    let radius = getTreeBaseRadius(tree_data);
    let log_volume = getLogVolume(tree_logs_segments);
    let energy_volume = getEnergyVolume(tree_data.branch, tree_logs_segments, tree_config_data.min_count_radius)

    global.trees_database.trees[id] = {
        measurement_date: pos.year,
        species: tree_data.tree_species,
        radius: radius,
        height: height,
        quality: quality,
        vol1: log_volume,
        vol2: energy_volume,
        forest: pos.normalized_world_name,
        parcel: pos.parcel,
        owner: pos.owner,
        posx: tree_data.x,
        posy: tree_data.y,
        posz: tree_data.z
    }

    // console.info(` parcel ${pos.parcel} ; ${tree_data.tree_species} ; ${radius} x ${height} qlt : ${quality}, vol1 : ${log_volume} m³, vol2 : ${energy_volume} m³`)

    return id
}



function recoverLostTrees(player) {

    let forest = global.treePosMetadata(player, player).normalized_world_name

    let mark_db = loadTreeData(player, `${forest}MarkedDatabase`)

    if (!mark_db || !mark_db.marked || !mark_db.marked.trees) {
        messageChat(player, "Aucun arbre marqué dans cette forêt.")
        return
    }

    let recovered = 0

    for (let tree_id of Object.keys(mark_db.marked.trees)) {

        console.info(`[RECOVER] Recherche de l'arbre : ${tree_id}`)

        let parts = tree_id.split("_")

        let x = Number(parts[0])
        let z = Number(parts[1])

        // Recherche du rooty sur X/Z
        for (let y = 64; y < 256; y++) {

            let rooty = player.level.getBlock(x, y, z)

            if (!dt_rooty_blocks.includes(rooty.id)) {
                continue
            }

            // Exactement comme findTrees()
            let block = player.level.getBlock(x, y + 1, z)

            console.info(`[RECOVER] Bloc arbre : ${block}`)

            let fake_event = {
                player: player,
                level: player.level,
                block: block
            }

            let ctx = global.verifyAndGetTreeContext(fake_event)

            if (!ctx) {
                console.warn(`[RECOVER] Impossible de reconstruire le contexte pour ${tree_id}`)
                break
            }

            // Utilise exactement le même chemin que findTrees()
            let id = handleMeasureEvents(ctx, true)

            if (id) {
                recovered++

                console.info(`[RECOVER] Arbre restauré : ${id}`
                )
            }

            // Un seul rooty par X/Z
            break
        }
    }

    saveCachedData(player)

    messageChat(player, `✔ ${recovered} arbres restaurés dans ${forest}.`
    )
}