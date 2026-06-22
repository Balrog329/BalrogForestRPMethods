
function markTree(player, block, species, pos_data, mark_config) {

    let tree_id = measureTree(player, block, species, pos_data)
    if (!tree_id) return

    let tree_data = loadTreeData(player,`${pos_data.normalized_world_name}_trees_database`).trees[tree_id]

    if (!tree_data) return

    let mark_data = loadmarkedData(player,`${pos_data.normalized_world_name}_marked_database`)

    if (mark_data.marked.trees[tree_id]) {messageChat(player, "Cet arbre est déjà marqué.")
        return
    }

  
    findTreePosMark(player, mark_data, tree_id, mark_config.mark_name, `${pos_data.normalized_world_name}_marked_database`)

    messageChat(player,`${tree_data.species} - ${tree_data.diameter} - ${tree_data.height} marqué en ${mark_config.mark_name}`)

    findTreePosMark(player, block, mark_config);
}


function findTreePosMark(player, mark_data, tree_id, mark_name, json_name){
    mark_data.marked.trees[tree_id]= {
         mark_name: mark_name,
        }
    saveTreeData(player, json_name, mark_data)
}



function reserveMarkedTree(player, block, pos_data) {

    let mark_data = loadmarkedData(
        player,
        `${pos_data.normalized_world_name}_marked_database`
    );

    let tree_id = getTreePositionStr(block);

    if (!mark_data.marked.trees[tree_id]) {
        messageChat(player, "Aucun arbre marqué à cet endroit.");
        return;
    }

    delete mark_data.marked.trees[tree_id];

    saveTreeData(
        player,
        `${pos_data.normalized_world_name}_marked_database`,
        mark_data
    );

    messageChat(player, `Arbre #${tree_id} retiré du marquage.`);
}