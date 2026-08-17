
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

    let positions = findBlock(player, player.getBlock().x, player.getBlock().y, player.getBlock().z, radius, dt_rooty_blocks)
    let tree_ids = []

    for (const pos of positions) {

        let fakeEvent = {
            player: player,
            level: player.level,
            block: player.level.getBlock(pos.x, pos.y + 1, pos.z)
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

function findBlock(player, x, y, z, radius, block_ids) {
    const player_level = player.level
    let positions = []

    for (let i = x - radius; i <= x + radius; i++) {
        for (let j = y - radius; j <= y + radius; j++) {
            for (let k = z - radius; k <= z + radius; k++) {

                if (block_ids.includes(player_level.getBlock(i, j, k).id)) {
                    positions.push({x: i, y: j, z: k })
                }
            }
        }
    }

    return positions
}


function dtSpecieToDtSpecie(player, radius, species1, species2) {
    // transforme une essenec vers une autre dans un rayon donnée grace a WE
    species1 = species1.replace("mega:", "mega_")
    species2 = species2.replace("mega:", "mega_")
    
    messageChat(player, `-------------------------`)
    messageChat(player, `Transformation de ${species1} vers ${species2}`)
    messageChat(player, `-------------------------`)
    messageChat(player, `${player.runCommandSilent(`/gmask`)}`)
    messageChat(player, `--> radius 8 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=8] ${species2}_branch[radius=8]`)}`)
    messageChat(player, `--> radius 7 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=7] ${species2}_branch[radius=7]`)}`)
    messageChat(player, `--> radius 6 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=6] ${species2}_branch[radius=6]`)}`)
    messageChat(player, `--> radius 5 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=5] ${species2}_branch[radius=5]`)}`)
    messageChat(player, `--> radius 4 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=4] ${species2}_branch[radius=4]`)}`)
    messageChat(player, `--> radius 3 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=3] ${species2}_branch[radius=3]`)}`)
    messageChat(player, `--> radius 2 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=2] ${species2}_branch[radius=2]`)}`)
    messageChat(player, `--> radius 1 : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=1] ${species2}_branch[radius=1]`)}`)
    messageChat(player, `--> feuillage : ${player.runCommandSilent(`/replacenear ${radius} ${species1}_leaves ${species2}_leaves`)}`)
    messageChat(player, `-------------------------`)
    messageChat(player, `Transformation terminée !`)
    messageChat(player, `-------------------------`)
}
