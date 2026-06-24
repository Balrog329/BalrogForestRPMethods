
PlayerEvents.loggedIn(event => {
    let player = event.player
    let world_name = getMcWorld(player)
    
    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    messageChat(player,"§a🌲  Gestion Forestière")
    messageChat(player,"§6📍 Carte : " + world_name)
    messageChat(player,"§e🚜 Système chargé avec succès")
    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    let sbs = ["lot_id", "height", "qlt", "forestManagement"]
    for (let sb of sbs) {
        createScoreboard(player, sb)
        resetScoreboard(player, sb)
    } 
})


ServerEvents.tick(event => {

    counter++

    if (counter < 6000) {return}

    counter = 0

    const server = event.server

    server.players.forEach(player => {
            let world = getMcWorld(player)
            let dimension = getMcDimension(player)

            if (getScoreboardValue(player, "forestManagement") == 0 ||
                getMcDimension(player) !== "minecraft:overworld") {return}
            
            summonEntity(server, player)

    })

})

BlockEvents.rightClicked(event => {
    let block = event.block
    let player = event.player
    let sneaking = player["emf$isSneaking"]()

    // Vérifications générales
    if (getScoreboardValue(player, "forestManagement") == 0 ||
        getMcDimension(player) !== "minecraft:overworld") {return}

    let itemId = getItemId(event.item)

    let context_class = getContextClass(player)

    let tree_data = callTreeScanner(BlockPos(block.x, block.y, block.z))

    if (tree_data.tree_species == "none") {return}

    const pos = treePosMetadata(player, tree_data)
    if (!pos) {return}

    let forest_name = pos.normalized_world_name
    let trees_database = loadTreeData(player, `${forest_name}TreeDatabase`)


    // Mesure
    if (itemId == "immersiveengineering:hoe_steel"){
        let counted_mark_config = loadConfigData(player, "globalforestconfig").treeMark.counted

        let id = measureTree(player, tree_data, pos, trees_database)
        if (!id) {return}

        findPhysicalTreeMark(player, trees_database.trees[id], counted_mark_config)
    }


    // Marteau
    if (itemId == "immersiveengineering:hammer") {

        let mark_hammer_config = loadConfigData(player, "globalforestconfig").treeMark.hammering;

        let lot_data = getLot(player, pos);

        let id = measureTree(player, tree_data, pos, trees_database)
        if (!id) {return}

        if (sneaking) {
            reserveHammeringTree(player, tree_data, pos, lot_data)
        } else {
            hammaringTree(player, id, trees_database.trees[id], mark_hammer_config, lot_data)
        }

        return
    }


    // Marquage avenir
    let mark_config = null

    if (itemId == "immersiveengineering:dust_aluminum") {
        mark_config = loadConfigData(player, "globalforestconfig").treeMark.futur
    }
    // Marquage abandon
    if (itemId == "immersiveengineering:dust_copper") {
        mark_config = loadConfigData(player, "globalforestconfig").treeMark.abandon
    }
    if (!mark_config) {return}

    let id = measureTree(player, tree_data, pos, trees_database)

    if (sneaking) {
        reserveMarkedTree(player, id, trees_database.trees[id])
        return
    } else {
        markTree(player, id, trees_database.trees[id], mark_config)
        return
    }

    // divers test
    if (itemId == "minecraft:compass") {

    
        let context_class = getContextClass(player)

        let tree_data = callTreeScanner(BlockPos(block.x, block.y, block.z))

        if (tree_data.tree_species !== "none") {
            let branch_list = tree_data.branch
            

            console.info("==================================================")
            console.info(`[DONNÉES ARBRE] Essence : ${tree_data.tree_species}`)
            console.info(`[DONNÉES ARBRE] Racine  : X=${tree_data.x}, Z=${tree_data.z}`)
            console.info(`[DONNÉES ARBRE] racine: ${tree_data.rooty_block}`)
            console.info(`[DONNÉES ARBRE] volume: ${tree_data.volume_total}`)
            console.info(`[DONNÉES ARBRE] Nombre de segments : ${branch_list.size()}`)
            console.info("--------------------------------------------------")
            console.info(" [Liste des Branches]");

            // Boucle brute sur le nœud "branch"
            for (let i = 0; i < branch_list.size(); i++) {
                let b = branch_list.get(i);
                
                console.info(`  -> Segment n°${i + 1} :`)
                console.info(`     pos    : X=${b.x}, Y=${b.y}, Z=${b.z}`)
                console.info(`     radius : ${b.radius}`)
                console.info(`     volume : ${b.volume.toFixed(5)} m³`)
            }
            
            console.info("==================================================")

            player.tell(`§a[KubeJS] Scan terminé. ${branch_list.size()} segments envoyés dans la console !`)
        } else {
            player.tell("§c[KubeJS] Aucun arbre de Dynamic Trees détecté à cet endroit.")
        }
        
    }
})
