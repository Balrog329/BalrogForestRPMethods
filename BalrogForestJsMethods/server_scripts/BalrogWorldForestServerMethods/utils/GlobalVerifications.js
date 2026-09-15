
// Définition de la fonction globale de vérification et récupération
global.verifyAndGetTreeContext = (event) => {
    let player = event.player
    let block = event.block

    if(!block.id.includes("branch")) {
        return false
    }

    if (claimProprieties(event) === false ) {
        return false
    }


    if (event.hand == "OFF_HAND") {
        return false
    }

    let tree_data = callTreeScanner(BlockPos(block.x, block.y, block.z))
    console.info(tree_data)
    
    if (!tree_data || tree_data.tree_species === "none") {return false}

    let forest_name = global.resolveForestNameByPos(block.x, block.z) || "public"


    return {
        player: player,
        block: block,
        facing: event.facing || "north",
        level: event.level,
        sneaking: player["emf$isSneaking"](),
        itemId: getItemId(player.getMainHandItem()),
        contextClass: getContextClass(player),
        tree_data: tree_data,
        forest_name: forest_name,
    }
}