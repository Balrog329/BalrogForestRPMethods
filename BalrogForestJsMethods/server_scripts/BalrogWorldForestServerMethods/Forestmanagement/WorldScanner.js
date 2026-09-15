
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


function dtSpecieToDtSpecie(radius, species1, species2) {
    // transforme une essenec vers une autre dans un rayon donnée grace a WE
    species1 = species1.replace("mega:", "mega_")
    species2 = species2.replace("mega:", "mega_")
    
    messageChat(Utils.server, `-------------------------`)
    messageChat(Utils.server, `Transformation de ${species1} vers ${species2}`)
    messageChat(Utils.server, `-------------------------`)
    messageChat(Utils.server, `${Utils.server.runCommandSilent(`/gmask`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=14] ${species2}_branch[radius=14]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=13] ${species2}_branch[radius=13]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=12] ${species2}_branch[radius=12]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=11] ${species2}_branch[radius=11]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=10] ${species2}_branch[radius=10]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=9] ${species2}_branch[radius=9]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=8] ${species2}_branch[radius=8]`)}`)
    messageChat(Utils.server, `--> radius 7 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=7] ${species2}_branch[radius=7]`)}`)
    messageChat(Utils.server, `--> radius 6 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=6] ${species2}_branch[radius=6]`)}`)
    messageChat(Utils.server, `--> radius 5 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=5] ${species2}_branch[radius=5]`)}`)
    messageChat(Utils.server, `--> radius 4 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=4] ${species2}_branch[radius=4]`)}`)
    messageChat(Utils.server, `--> radius 3 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=3] ${species2}_branch[radius=3]`)}`)
    messageChat(Utils.server, `--> radius 2 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=2] ${species2}_branch[radius=2]`)}`)
    messageChat(Utils.server, `--> radius 1 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=1] ${species2}_branch[radius=1]`)}`)
    messageChat(Utils.server, `--> feuillage : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_leaves ${species2}_leaves`)}`)
    messageChat(Utils.server, `-------------------------`)
    messageChat(Utils.server, `Transformation terminée !`)
    messageChat(Utils.server, `-------------------------`)
}
