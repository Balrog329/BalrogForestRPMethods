function lotExploitation(player, lot_id) {
    const forest = global.pos_data.normalized_world_name
    const tree_json_name = `${forest}Treesdatabase`
    const lot_db_name = `${forest}LotDatabase`

    const lot_full_db = loadTreeData(player, lot_db_name)
    const lot_database = lot_full_db.lots[lot_id]

    // Vérification du statut
    if (lot_database.statut === "cutting" || lot_database.statut === "cutted") {
        messageChat(player, `Le lot ${lot_id} a déjà été exploité`)
        return
    }

    // Chargement des données nécessaires
    const trees_db = global.trees_database
    const species_cfg = loadConfigData(player, "speciesdata")

    // Récupération de la liste des arbres non récoltés
    const valid_trees = []
    for (let tree_id in lot_database.trees) {
        let tree_data = trees_db.trees[tree_id]
        if (tree_data && !tree_data.harvested) {
            valid_trees.push(tree_data)
        }
    }

    if (valid_trees.length === 0) {
        messageChat(player, `Aucun arbre à couper dans le lot ${lot_id}.`)
        return
    }

    // Mise à jour du lot en "incutting"
    if (!lot_database.statut || lot_database.statut === "pending") {
        messageChat(player, `Le lot ${lot_id} n'est pas vendu !`)
        return
    }
    lot_database.statut = "incutting"
    saveTreeData(player, lot_db_name, lot_full_db)
    messageChat(player, `Début de l'exploitation du lot ${lot_id}`)

    // Programmation séquentielle de chaque arbre toutes les 2 secondes (40 ticks)
    valid_trees.forEach((tree_data, index) => {
        let delay = (index + 1) * 40 // 40 ticks = 2s, 80 ticks = 4s, etc.

        player.server.scheduleInTicks(delay, callback => {
            // Abattage / Souche
            
            loadChunk(player, "add", tree_data.posx, tree_data.posz)
                player.server.scheduleInTicks(60, callback => {
                tree_data.harvested = true
                if (lot_database.statut === "sold") {return}
                const cfg = species_cfg[tree_data.species]
                setStump(player.level, player, cfg.stump_block, tree_data)

                // on retire le marquage

                deleteTreeMark(player, tree_data)
                console.info(`${tree_data.species} was cut at ${tree_data.posx -1} ${tree_data.posy} ${tree_data.posz}`)
                // on pose les branches au sol ?

                player.server.scheduleInTicks(10, callback => {
                    loadChunk(player, "remove", tree_data.posx, tree_data.posz)
                })
            })


            // 2. Si c'est le dernier arbre, on finalise le lot
            if (index === valid_trees.length - 1) {
                lot_database.statut = "cutted"
                saveTreeData(player, lot_db_name, lot_full_db)
                messageChat(player, `Exploitation du lot ${lot_id} terminée.`)
                // si le lot est terminé on donne 150% du prix de vente à exploitant
                transaction("BANK", lot_database.buyer, lot_database.sold_price * 1.5)
                addInManagementBook(
                    player,
                    lot_id,
                    "lot_bp",
                    global.pos_data.year,
                    tree_data.parcel,
                    `Lot n°${lot_id}, l'exploitation (abattage+débardage) de ce lot est terminé`
                )
            }
        })
    })

    // Sauvegarde unique des données d'arbres
    saveCachedData(player)
}


