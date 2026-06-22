function hammaringTree(block, player, tree_id, tree_data, pos_data, mark_config, lot_data) {

    if (!testIfHammerableTree(player, tree_data.species, tree_data.diameter, tree_data.height)) {

        messageChat(player, "Cet arbre est un bois de chauffage")
        return
    }

    if (lot_data.lot.trees[tree_id]) {
        messageChat(player, "Cet arbre est déjà présent dans le lot.")
        return
    }

    lot_data.lot.trees[tree_id] = true

    saveTreeData(player, lot_data.json_name, lot_data.database)

    findTreePosMark(player, block, mark_config)

    messageChat(player, `${tree_data.species} - Ø${tree_data.diameter} - H${tree_data.height} ajouté au lot ${lot_data.lot.id}`)
}

function addtree_lot(player, lot_data, tree_id, json_name){
    lot_data.lot.trees[tree_id] = true
    saveTreeData(player, json_name, lot_data)
}


function reserveTree(player, block, pos_data, lot_data) {

    let tree_id = getTreePositionStr(block);

    if (!lot_data.lot.trees[tree_id]) {
        messageChat(player, "Aucun arbre trouvé dans ce lot.");
        return;
    }

    delete lot_data.lot.trees[tree_id];

    saveTreeData(player, lot_data.json_name, lot_data.database);

    messageChat(player, `Arbre #${tree_id} retiré du lot.`);
}
function testIfHammerableTree(player, species, diameter, height) {

    let species_data = loadConfigData(player, "speciesdata")[species]

    if (!species_data) {return false}

    if (!species_data.hammerable) {return false}

    if (Number(diameter) / 2 <= species_data.min_log_radius) {return false}

    if (Number(height) <= 3) {return false}

    return true
}