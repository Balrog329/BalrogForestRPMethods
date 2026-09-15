
function measureTree(tree_data) {
    const species = tree_data.tree_species
    const cfg = global.species_config[species]

    const id = `${getTreePositionStr(tree_data)}_${tree_data.volume_total}`
    const radius = getTreeBaseRadius(tree_data)

    const is_hammerable = testIfHammerableTree(tree_data.tree_species, radius)
    const segments = getTreeLogSegments(tree_data, cfg, is_hammerable)
    const height = segments.length
    if (height === 0) return

    const level = Utils.server.getLevel("minecraft:overworld").getBlock(tree_data.x, tree_data.y, tree_data.z).properties.fertility

    const quality = level === 0 ? 2 : cfg.default_quality


    const vol1 = getLogVolume(segments)
    const vol2 = getEnergyVolume(tree_data.branch, segments, cfg.min_count_radius)

    const forest = global.resolveForestNameByPos(tree_data.x, tree_data.z)
    const parcel = global.resolveParcelNameByPos(tree_data.x, tree_data.z)
    const owner = global.forest_management[forest].owner

    return addDatTrees(id, species, radius, height, quality, tree_data, vol1, vol2, forest, parcel, owner)
}

function treeAnnouncement(advertiser, pointer, tree_id) {
    let dt = global.trees_database.trees[tree_id]
    let species = global.species_config[dt.species].french_name
    let radius = dt.radius
    let height
    let dead
    if (dt.height === 10) {
        height = "deca"
    } else {
        height = `par ${dt.height}`
    }

    if (dt.is_dead === true) {
        dead = ", sec"
    } else {
        dead = ""
    }

    messageChat(Utils.server, `§b§l${advertiser} : ${species}, ${radius} ${height} ${dead} !`)
    messageChat(Utils.server, `§2§l${pointer} : ${species}, ${radius} ${height} ${dead} !`)
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
                block: block,
                facing: "north"
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


function restoretreesLot(player) {
    for (let tree_id in global.trees_database.trees) {
        let tree_data = global.trees_database.trees[tree_id]
        if (Number(tree_data.parcel) === 30 || Number(tree_data.parcel) === 32) {
            let block = Utils.server.getLevel("minecraft:overworld").getBlock(tree_data.posx - 1, tree_data.posy + 1, tree_data.posz)
            if (block === 'kubejs:red_foot_mark[facing=west]') {
                let fakeEvent = {
                    player: player,
                    level: player.level,
                    block: player.level.getBlock(tree_data.posx, tree_data.posy + 1, tree_data.posz),
                    facing: "north"
                }

                let ctx = global.verifyAndGetTreeContext(fakeEvent)
                if (!ctx) continue

                let id = id = handleHammerEvent(ctx)
            }
        }
    }
}

function restoretreesMarked(player, parcel) {
    for (let tree_id in global.trees_database.trees) {
        let tree_data = global.trees_database.trees[tree_id]
        if (String(tree_data.parcel) === String(parcel)) {
            let block = Utils.server.getLevel("minecraft:overworld").getBlock(tree_data.posx, tree_data.posy + 2, tree_data.posz - 1)
            if (block === 'kubejs:red_oblique_mark[facing=north]') {
                let fakeEvent = {
                    player: player,
                    level: player.level,
                    block: player.level.getBlock(tree_data.posx, tree_data.posy + 1, tree_data.posz),
                    facing: "north"
                }

                let ctx = global.verifyAndGetTreeContext(fakeEvent)
                if (!ctx) continue

                let id = handleMarkingEvent(ctx, "abandon" )
                console.info("restored " + id)
            }
        }
    }
}