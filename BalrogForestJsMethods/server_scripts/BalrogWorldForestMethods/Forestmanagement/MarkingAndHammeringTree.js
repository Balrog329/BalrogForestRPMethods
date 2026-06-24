
function markTree(player, tree_id, tree_database, mark_config) {
    let marked_database_name = `${tree_database.forest}MarkedDatabase`
    let mark_data = loadmarkedData(player, tree_database.forest, marked_database_name)

    // Vérifie s'il est déjà marqué
    if (mark_data.marked.trees[tree_id]) {
        messageChat(player, "Cet arbre est déjà marqué.")
        return
    }

    mark_data.marked.trees[tree_id] = {
        mark_name: mark_config.mark_name,
    }
    saveTreeData(player, marked_database_name, mark_data)

    messageChat(player, `Marqué en ${mark_config.mark_name}`);

    findPhysicalTreeMark(player, tree_database, mark_config);
}

function reserveMarkedTree(player, tree_id, tree_database) {
    let mark_data = loadmarkedData(player, tree_database.forest, `${tree_database.forest}MarkedDatabase`)

    if (!mark_data.marked.trees[tree_id]) {
        messageChat(player, "Aucun arbre marqué ou martelé à cet endroit.")
        return
    }

    delete mark_data.marked.trees[tree_id]
    saveTreeData(player, `${tree_database.forest}MarkedDatabase`, mark_data)

    messageChat(player, `Arbre #${tree_id} retiré du marquage.`)

}



function hammaringTree(player, tree_id, tree_database, mark_hammer_config, lot_data) {
    if (!testIfHammerableTree(player, tree_database.species, tree_database.radius, tree_database.height)) {
        messageChat(player, "Cet arbre est un bois de chauffage (non martelable).") 
        {return}
    }

    if (lot_data.lot.trees[tree_id]) {
        messageChat(player, "Cet arbre est déjà présent dans le lot.")
        {return}
    }

    lot_data.lot.trees[tree_id] = true

    calculLotVolume(player, tree_database, lot_data.lot)

    saveTreeData(player, lot_data.json_name, lot_data.database)

    findPhysicalTreeMark(player, tree_database, mark_hammer_config)

    messageChat(player, `Ajouté au lot ${lot_data.lot.id}`)
}


function testIfHammerableTree(player, species, radius, height) {
    let species_data = loadConfigData(player, "speciesdata")[species]
    if (!species_data) return false
    if (!species_data.hammerable) return false

    if (Number(radius) <= species_data.min_log_radius) return false

    return true
}



function reserveHammeringTree(player, tree_data, pos_data, lot_data) {

    let tree_id = `${getTreePositionStr(tree_data)}_${tree_data.volume_total}`

    if (!lot_data.lot.trees[tree_id]) {
        messageChat(player, "Aucun arbre trouvé dans ce lot.")
        {return}
    }

    delete lot_data.lot.trees[tree_id]

    saveTreeData(player, lot_data.json_name, lot_data.database)

    messageChat(player, `Arbre #${tree_id} retiré du lot.`)
}


function findPhysicalTreeMark(player, tree_database, mark_config) {
    for (let key in mark_config.marks) {
        let mark = mark_config.marks[key];

        let dx = mark.offset[0]
        let dy = mark.offset[1] + 2
        let dz = mark.offset[2] 

        addTreeMark(player, `${tree_database.posx + dx} ${tree_database.posy + dy} ${tree_database.posz + dz}`, mark.block);
    }
}

function addTreeMark(player, pos, blockId) {
    player.runCommandSilent(`setblock ${pos} ${blockId} replace`);
}
