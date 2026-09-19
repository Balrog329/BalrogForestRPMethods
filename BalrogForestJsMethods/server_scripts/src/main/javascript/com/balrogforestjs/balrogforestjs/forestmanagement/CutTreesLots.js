function lotExploitation(player, lot_id) {

    // Vérification du statut
    if (global.lot_database.lots[lot_id].statut === "cutting" || global.lot_database.lots[lot_id].statut === "cutted") {
        messageChat(Utils.server, `Le lot ${lot_id} a déjà été exploité`)
        return
    }

    // Chargement des données nécessaires
    const trees_db = global.trees_database

    // Récupération de la liste des arbres non récoltés
    const valid_trees = []
    for (let tree_id in global.lot_database.lots[lot_id].trees) {
        let tree_data = trees_db.trees[tree_id]
        if (tree_data && !tree_data.harvested) {
            valid_trees.push(tree_data)
        }
    }

    if (valid_trees.length === 0) {
        messageChat(Utils.server, `Aucun arbre à couper dans le lot ${lot_id}.`)
        return
    }

    // Mise à jour du lot en "incutting"
    if (!global.lot_database.lots[lot_id].statut || global.lot_database.lots[lot_id].statut === "pending") {
        messageChat(Utils.server, `Le lot ${lot_id} n'est pas vendu !`)
        return
    }
    global.lot_database.lots[lot_id].statut = "incutting"
    messageChat(Utils.server, `Début de l'exploitation du lot ${lot_id}`)

    // Programmation séquentielle de chaque arbre toutes les 2 secondes (40 ticks)
    valid_trees.forEach((tree_data, index) => {
        let delay = (index + 1) * 40 // 40 ticks = 2s, 80 ticks = 4s, etc.

        player.server.scheduleInTicks(delay, callback => {
            // Abattage / Souche
            
            loadChunk("add", tree_data.posx, tree_data.posz)
            player.server.scheduleInTicks(60, callback => {
                tree_data.harvested = true
                if (global.lot_database.lots[lot_id].statut === "sold") {return}
                const cfg = global.species_config[tree_data.species]
                setStump(player, cfg.stump_block, tree_data)

                // on retire le marquage

                deleteTreeMark(tree_data)
                console.info(`${tree_data.species} was cut at ${tree_data.posx -1} ${tree_data.posy} ${tree_data.posz}`)
                // on pose les branches au sol ?

                player.server.scheduleInTicks(10, callback => {
                    loadChunk("remove", tree_data.posx, tree_data.posz)

                })
            })


            // 2. Si c'est le dernier arbre, on finalise le lot
            if (index === valid_trees.length - 1) {
                global.lot_database.lots[lot_id].statut = "cutted"
                messageChat(Utils.server, `Exploitation du lot ${lot_id} terminée.`)
                // si le lot est terminé on donne 150% du prix de vente à exploitant
                transaction("BANK", global.lot_database.lots[lot_id].buyer, global.lot_database.lots[lot_id].sold_price * 1.5)
                addInManagementBook(
                    lot_id,
                    "lot_bp",
                    tree_data.parcel,
                    `Lot n°${lot_id}, l'exploitation (abattage+débardage) de ce lot est terminé`
                )
            }
        })
    })

    // Sauvegarde unique des données d'arbres
    saveCachedData()
}


