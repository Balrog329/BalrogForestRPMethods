
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

    global.proprieties = loadProprietiesdat()

    global.entities = loadEntitiesDat()

    global.trees_database = loadNBTTreeData()

    global.marked_trees_database = loadMarkedTreesDb()

    global.lot_database = loadLotDat()

    global.forest_quotes = loadQuotes()

    global.forest_book = loadManagementBook()

    global.server_date = initServerDate()
}


function saveCachedData() {

    let server_ctx = loadConfigData('serversregistry')

    // sauvegarde auto du server
    if (!server_ctx.serversregistry[global.getServerContext().normalized_serverName]) {
        console.info("test")
        server_ctx.serversregistry[global.getServerContext().normalized_serverName] = global.getServerContext()
        saveConfigFile("serversregistry", server_ctx)
    }

    // sauvegarde des bdd

    saveDat('trees', global.trees_database)

    saveDat('management_book', global.forest_book)

    saveDat('marked_trees', global.marked_trees_database)

    saveDat('woodlot', global.lot_database)

    saveDat('quotes', global.forest_quotes)

    saveDat("entities", global.entities)

    saveConfigFile("serversregistry", global.server_registry)

    saveDat('proprieties', global.proprieties)

    global.server_date.last_save = getIrlDate().getTime();

    saveDat('servertime', global.server_date)

    console.info("Bases de données sauvegardées")
    messageChat(Utils.server, "§a[BF package] Sauvegarde auto réalisée ! ")
    return true
}





