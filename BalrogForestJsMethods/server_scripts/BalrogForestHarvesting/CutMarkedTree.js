
function markedTreeExploitation(player, property, parcel) {

    if (!global.marked_trees_database.marked || !global.marked_trees_database.marked.trees) {
        messageChat(player, "❌ Aucun arbre marqué sur le serveur.")
        return
    }

    // Sélection des arbres marqués "abandon" dans la parcelle donnée
    const marked_trees = _getMarkedTree(property, parcel)

    if (marked_trees.length === 0) {
        messageChat(player, `❌ Aucun arbre marqué 'abandon' dans la parcelle ${parcel}.`)
        return
    }

    messageChat(Utils.server, property + `, début de l'exploitation des arbres marqués 'abandon' dans la parcelle ` + parcel)

    // Variables cumulatives
    let total_volume = 0
    let total_price = 0
    let tree_lenght = 0

    marked_trees.forEach((tree_id, index) => {

        const tree_data = global.trees_database.trees[tree_id]
        const delay = (index + 1) * 20 // 1 secondes par arbre

        player.server.scheduleInTicks(delay, callback => {

            // Volume cumulé
            total_volume += tree_data.vol1

            // Prix dynamique du bois
            const tree_price = getTreeLogDynamicPrice(tree_data.species, tree_data.quality, tree_data.is_dead)
            total_price += tree_price

            // essaie du chargement des chunk
            loadChunk("add", tree_data.posx, tree_data.posz)
            // Marquer comme coupé
            player.server.scheduleInTicks(50, callback => {

                // Pose de la souche
                const cfg = global.species_config[tree_data.species]

                if (cfg.stump_block.includes("dynamictrees")){
                    setDtStump(player, tree_data.species, cfg.stump_block, tree_data)
                }
                else {
                    setStump(player, cfg.stump_block, tree_data)
                }

                // Suppression du marquage
                delete global.marked_trees_database.marked.trees[tree_id]
                deleteTreeMark(tree_data)

                console.info(`[CUT] ${tree_data.species} | volume=${tree_data.vol1} | prix=${tree_price} | pos=${tree_data.posx} ${tree_data.posy} ${tree_data.posz}`)
                tree_lenght +=1
                console.info(marked_trees.length)
                advencementBar("Exploitation P" + parcel, marked_trees.length, tree_lenght)
                player.server.scheduleInTicks(10, callback => {
                    loadChunk("remove", tree_data.posx, tree_data.posz)

                    // suppression de l'arbre de la bd
                    delete global.trees_database.trees[tree_id]
                })
            })

            // Dernier arbre → sauvegarde finale
            if (index === marked_trees.length - 1) {
                saveCachedData()

                messageChat(Utils.server, `✔ Exploitation terminée : ${marked_trees.length} arbres coupés.`)
                messageChat(Utils.server, `📦 Volume total receptionné : ${total_volume.toFixed(2)} m³`)
                messageChat(Utils.server, `💰 Valeur totale du bois : ${total_price} Z`)
                transaction("BANK", tree_data.owner, total_price)
                addInManagementBook(
                    `${global.server_date.year}${tree_data.parcel}${total_volume}`,
                    "exploit_up",
                    property,
                    tree_data.parcel,
                    `Exploitation en UP de ${total_volume} dans la parcelle ${tree_data.parcel} terminée`
                    )
            }
        })
    })
}


function _getMarkedTree(property, parcel) {
    let trees = []
    let markedMap = global.marked_trees_database?.marked?.trees
    let treesMap = global.trees_database?.trees

    if (!markedMap || !treesMap) return trees

    for (let tree_id in markedMap) {
        let mark = markedMap[tree_id]
        let tree_data = treesMap[tree_id]

        // 1. On vérifie que tree_data existe
        // 2. String(tree_data.parcel) convertit l'Integer Java en String JS pour matcher l'argument
        if (tree_data && mark?.mark_name === "abandon") {
            if (tree_data.forest === property && String(tree_data.parcel) === String(parcel)) {
                trees.push(tree_id)
            }
        }
    }

    return trees
}

