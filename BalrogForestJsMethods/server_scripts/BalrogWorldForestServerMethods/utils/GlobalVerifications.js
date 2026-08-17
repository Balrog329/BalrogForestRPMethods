
// Définition de la fonction globale de vérification et récupération
global.verifyAndGetTreeContext = (event) => {
    let player = event.player
    let block = event.block

    if(!block.id.includes("branch")) {
        return false
    }

    if (event.hand == "OFF_HAND") {
        return false
    }

    if (getMcDimension(player) !== "minecraft:overworld") {
        messageChat(player, "Veuillez vous rendre dans l'overworld pour effectuer ces opérations...")
        return false}

    let tree_data = callTreeScanner(BlockPos(block.x, block.y, block.z))

    if (!tree_data || tree_data.tree_species == "none") {return false}

    const pos = global.treePosMetadata(player, tree_data)
    if (!pos) {return false}

    let forest_name = pos.normalized_world_name

    global.pos_data = pos

    return {
        player: player,
        block: block,
        level: event.level,
        sneaking: player["emf$isSneaking"](),
        itemId: getItemId(player.getMainHandItem()),
        contextClass: getContextClass(player),
        tree_data: tree_data,
        pos_data: pos,
        forest_name: forest_name,
    }
}