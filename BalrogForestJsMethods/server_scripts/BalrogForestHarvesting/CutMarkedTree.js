
function markedTreeExploitation(player, parcel) {

    const forest = global.pos_data.normalized_world_name
    const mark_db_name = `${forest}MarkedDatabase`

    const trees_db = global.trees_database
    const mark_db = loadTreeData(player, mark_db_name)
    const species_cfg = loadConfigData(player, "speciesdata")

    if (!mark_db.marked || !mark_db.marked.trees) {
        messageChat(player, "❌ Aucun arbre marqué dans cette forêt.")
        return
    }

    // Sélection des arbres marqués "abandon" dans la parcelle donnée
    const marked_trees = Object.keys(mark_db.marked.trees).filter(tree_id => {
        const mark = mark_db.marked.trees[tree_id]
        const tree_data = trees_db.trees[tree_id]
        if (!tree_data) {
            return
        }

        return (
            mark.mark_name === "abandon" &&
            tree_data.parcel === parcel &&
            !tree_data.harvested
        )
    })

    if (marked_trees.length === 0) {
        messageChat(player, `❌ Aucun arbre marqué 'abandon' dans la parcelle ${parcel}.`)
        return
    }

    messageChat(player, `🌲 Début de l'exploitation des arbres marqués 'abandon' dans la parcelle ${parcel}.`)

    // Variables cumulatives
    let total_volume = 0
    let total_price = 0

    marked_trees.forEach((tree_id, index) => {

        const tree_data = trees_db.trees[tree_id]
        const delay = (index + 1) * 20 // 1 secondes par arbre

        player.server.scheduleInTicks(delay, callback => {

            // Volume cumulé
            total_volume += tree_data.vol1

            // Prix dynamique du bois
            const tree_price = getTreeLogDynamicPrice(player, tree_data.species)
            total_price += tree_price

            // essaie du chargement des chunk
            loadChunk(player, "add", tree_data.posx, tree_data.posz)
            // Marquer comme coupé
            player.server.scheduleInTicks(50, callback => {
                tree_data.harvested = true

                // Pose de la souche
                const cfg = species_cfg[tree_data.species]

                if (cfg.stump_block.includes("dynamictrees")){
                    setDtStump(player.level, player, tree_data.species, cfg.stump_block, tree_data)
                }
                else {
                    setStump(player.level, player, cfg.stump_block, tree_data)
                }

                // Suppression du marquage
                delete mark_db.marked.trees[tree_id]
                deleteTreeMark(player, tree_data)

                console.info(`[CUT] ${tree_data.species} | volume=${tree_data.vol1} | prix=${tree_price} | pos=${tree_data.posx} ${tree_data.posy} ${tree_data.posz}`)

                player.server.scheduleInTicks(10, callback => {
                    loadChunk(player, "remove", tree_data.posx, tree_data.posz)
                })
            })

            // Dernier arbre → sauvegarde finale
            if (index === marked_trees.length - 1) {
                saveCachedData(player)
                saveTreeData(player, mark_db_name, mark_db)

                messageChat(player, `✔ Exploitation terminée : ${marked_trees.length} arbres coupés.`)
                messageChat(player, `📦 Volume total receptionné : ${total_volume.toFixed(2)} m³`)
                messageChat(player, `💰 Valeur totale du bois : ${total_price} Z`)
                transaction("BANK", tree_data.owner, total_price)
                addInManagementBook(
                    player,
                    `${global.pos_data.year}${tree_data.parcel}${total_volume}`,
                    "exploit_up",
                    global.pos_data.year,
                    tree_data.parcel,
                    `Exploitation en UP de ${total_volume} dans la parcelle ${tree_data.parcel} terminée`
                    )
            }
        })
    })
}


