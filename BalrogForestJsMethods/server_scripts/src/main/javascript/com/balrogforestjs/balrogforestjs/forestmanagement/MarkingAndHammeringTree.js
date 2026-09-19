
function markTree(tree_id, tree_database, mark_config) {

    // Vérifie s'il est déjà marqué
    if (global.marked_trees_database.marked.trees[tree_id]) {
        messageChat(Utils.server, "Cet arbre est déjà marqué.")
        return
    }

    global.marked_trees_database.marked.trees[tree_id] = {
        mark_name: mark_config.mark_name,
    }
    messageChat(Utils.server, `Marqué en ${mark_config.mark_name}`);

    findPhysicalTreeMark(tree_database, mark_config);
}


function reserveMarkedTree(tree_id) {

    if (!global.marked_trees_database.marked.trees[tree_id]) {
        messageChat(Utils.server, "Aucun arbre marqué ou martelé à cet endroit.")
        return
    }

    delete global.marked_trees_database.marked.trees[tree_id]

    messageChat(Utils.server, `Arbre #${tree_id} retiré du marquage.`)
    deleteTreeMark(global.trees_database.trees[tree_id])
}



function hammaringTree(tree_id, tree_database, mark_hammer_config, lot_id) {
    if (!testIfHammerableTree(tree_database.species, tree_database.radius, tree_database.height)) {
        messageChat(Utils.server, "Cet arbre est un bois de chauffage (non martelable).")
        {return}
    }
    let lot_data = global.lot_database.lots[lot_id]

    if (lot_data.trees[tree_id]) {
        messageChat(Utils.server, "Cet arbre est déjà présent dans le lot.")
        {return}
    }

    if (["for_sale", "sold", "pending", "cutted", "incutting"].includes(lot_data.statut)) {
        messageChat(Utils.server, "Le lot est déjà vendu ou à vendre")
        {return}
    }

    lot_data.trees[tree_id] = global.resolveParcelNameByPos(tree_database.posx, tree_database.posz)
    lot_data.trees_number = Object.keys(lot_data.trees).length

    calculLotVolume(lot_data)

    lot_data.trees_mean_vol1 = (lot_data.volume1 / lot_data.trees_number).toFixed(3)

    findPhysicalTreeMark(tree_database, mark_hammer_config)

    messageChat(Utils.server, `Ajouté au lot ${lot_data.id}`)
}


function testIfHammerableTree(species, radius) {
    let species_data = global.species_config[species]
    if (!species_data) return false
    if (!species_data.hammerable) return false

    if (Number(radius) <= species_data.min_log_radius) return false

    return true
}


function reserveHammeringTree(tree_data, lot_id) {

    let lot_data = global.lot_database.lots[lot_id]
    let tree_id = `${getTreePositionStr(tree_data)}_${tree_data.volume_total}`

    if (!lot_data.trees[tree_id]) {
        messageChat(player, "Aucun arbre trouvé dans ce lot.")
        {return}
    }

    delete lot_data.trees[tree_id]
    lot_data.trees_number = Object.keys(lot_data.trees).length

    calculLotVolume(lot_data)
    
    lot_data.trees_mean_vol1 = (lot_data.volume1 / lot_data.trees_number).toFixed(3)

    messageChat(Utils.server, `Arbre #${tree_id} retiré du lot.`)
}


function findPhysicalTreeMark(tree_database, mark_config) {
    for (let key in mark_config.marks) {
        let mark = mark_config.marks[key];

        let dx = mark.offset[0]
        let dy = mark.offset[1] + 2
        let dz = mark.offset[2] 

        addTreeMark(`${tree_database.posx + dx} ${tree_database.posy + dy} ${tree_database.posz + dz}`, mark.block);
    }
}

function addTreeMark(pos, blockId) {
    Utils.server.runCommandSilent(`setblock ${pos} ${blockId} replace`);
}

function deleteTreeMark(tree_data) {

    const x = tree_data.posx;
    const y = tree_data.posy + 2;
    const z = tree_data.posz;

    addTreeMark(`${x - 1} ${y} ${z}`, "minecraft:air");
    addTreeMark(`${x + 1} ${y} ${z}`, "minecraft:air");
    addTreeMark(`${x} ${y} ${z - 1}`, "minecraft:air");
    addTreeMark(`${x} ${y} ${z + 1}`, "minecraft:air");
}