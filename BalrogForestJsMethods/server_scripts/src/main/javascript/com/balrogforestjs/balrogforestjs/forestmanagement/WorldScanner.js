
var dt_rooty_blocks = [
    "dynamictrees:rooty_grass_block",
    "dynamictrees:rooty_dirt",
    "dynamictrees:rooty_podzol",
    "dynamictrees:rooty_coarse_dirt",
    "dynamictrees:rooty_rooted_dirt",
    "dynamictrees:rooty_gravel",
    "dynamictrees:rooty_moss_block",
    "dynamictrees:rooty_moss"

]

global.normalizeSpecies = function(species) {
    if (!species) return species;

    // Trouver le premier "_"
    let idx = species.indexOf("_");
    if (idx === -1) return species; // aucun "_", on ne touche pas

    // Remplacer UNIQUEMENT le premier "_" par ":"
    return species.substring(0, idx) + ":" + species.substring(idx + 1);
}


function treesAction(player, action, radius, species) {
    let tree_ids = findTrees(player, action, radius, species)
    return tree_ids
}


function findTrees(player, action, radius, species) {
    if (species == undefined || species == "all") {
        species = null
    }

    let positions = findBlock(player.getBlock().x, player.getBlock().y, player.getBlock().z, radius, dt_rooty_blocks)
    let tree_ids = []

    for (const pos of positions) {

        let fakeEvent = {
            player: player,
            level: player.level,
            block: player.level.getBlock(pos.x, pos.y + 1, pos.z),
            facing: "north"
        }

        let ctx = global.verifyAndGetTreeContext(fakeEvent)
        if (!ctx) continue

        if (species !== null && ctx.tree_data.tree_species !== species) {
            continue
        }
        let id = null
        if (action === "measure") {
            id = handleMeasureEvents(ctx, true)
        } else if (action === "hammering") {
            id = handleHammerEvent(ctx)
        } else if (action === "marking") {
            id = handleMarkingEvent(ctx, "abandon")
        }
        if (id) {tree_ids.push(id)}
    }
    console.info(` [FINDTREES] Opération terminé, ${tree_ids.length} arbres affectés`)
    return tree_ids
}

function findBlock(x, y, z, radius, block_ids) {
    const level = Utils.server.getLevel("minecraft:overworld")
    let positions = []

    for (let i = x - radius; i <= x + radius; i++) {
        for (let j = y - radius; j <= y + radius; j++) {
            for (let k = z - radius; k <= z + radius; k++) {

                if (block_ids.includes(level.getBlock(i, j, k).id)) {
                    positions.push({x: i, y: j, z: k })
                }
            }
        }
    }

    return positions
}

