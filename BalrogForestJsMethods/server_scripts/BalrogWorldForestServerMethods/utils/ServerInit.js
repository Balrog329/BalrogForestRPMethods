
ServerEvents.loaded(event => {
    initCommand()
    loadCachedData()
    majServerDateBylastConnection()
    seasonChange()
    Utils.server.runCommandSilent("kubejs reload server_script")

})

function initCommand() {
    for (let command of [
        'defined_wood_lot 2011 None',
        'gamerule doSeasonCycle false'
    ]
        ) {
        Utils.server.runCommandSilent(command)
    }
}


function loadCachedData() {

    let forest_name = global.getServerContext().normalized_serverName


    global.forest_management = loadProprietiesdat()
    global.entities = loadEntitiesDat()
    //global.trees_database = loadTreeData(`${forest_name}TreesDatabase`)
    global.trees_database = loadNBTTreeData()
    //global.marked_trees_database = loadmarkedData(`${forest_name}MarkedDatabase`)
    global.marked_trees_database = loadMarkedTreesDb()

    //global.lot_database = loadLotData(forest_name + 'LotDatabase')
    global.lot_database = loadLotDat()

    global.forest_quotes = loadQuotes()
    global.forest_book = loadManagementBook()
    global.server_date = initServerDate()
}


function saveCachedData() {

    let forest_name = global.getServerContext().normalized_serverName
    let server_ctx = loadConfigData('serversregistry')

    // sauvegarde auto du server
    if (!server_ctx.serversregistry[global.getServerContext().normalized_serverName]) {
        console.info("test")
        server_ctx.serversregistry[global.getServerContext().normalized_serverName] = global.getServerContext()
        saveConfigFile("serversregistry", server_ctx)
    }

    // sauvegarde des bdd
    // arbre

    saveDat('trees', global.trees_database, false)
    saveDat('trees', global.trees_database, true)

    //saveTreeData(`${forest_name}TreesDatabase`, global.trees_database)
    //saveTreeData(`${forest_name}TreesDatabase_back`, global.trees_database)

    saveManagementBook(global.forest_book)
    
    //saveTreeData(`${forest_name}MarkedDatabase`, global.marked_trees_database)

    saveDat('marked_trees', global.marked_trees_database, false)
    saveDat('marked_trees', global.marked_trees_database, true)

    //saveTreeData(`${forest_name}LotDatabase`, global.lot_database)
    saveDat('woodlot', global.lot_database, false)
    saveDat('woodlot', global.lot_database, true)

    //saveTreeData(forest_name + '_forest_quotes', global.forest_quotes)
    
    saveDat('quotes', global.forest_quotes, false)
    saveDat('quotes', global.forest_quotes, true)

    //saveGlobalData('entities', global.entities)
    saveEntitiesDat("entities", global.entities, false)
    saveEntitiesDat("entities", global.entities, true)

    //saveGlobalData('entities_back', global.entities)
    saveConfigFile("serversregistry", global.server_registry)

    saveDat('proprieties', global.forest_management, false)
    saveDat('proprieties', global.forest_management, true)

    //saveConfigFile("forest_management", global.forest_management)
    //saveConfigFile("forest_management_back", global.forest_management)

    saveDat('servertime', global.server_date, false)
    saveDat('servertime', global.server_date, true)

    console.info("Bases de données sauvegardées")
    messageChat(Utils.server, "§a[BF package] Sauvegarde auto réalisée ! ")
    return true
}





