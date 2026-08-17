global.TreeDatabase = null


var init_command = [
    'defined_wood_lot 2011 None',
    'gamerule doSeasonCycle false'
]

function initCommand(player) {
    for (let command of init_command) {
        Utils.server.runCommandSilent(command)
    }
}

function serverInit(player) {
    initCommand(player)
    loadCachedData(player)
    majServerDateBylastConnection(player)
    seasonChange()
}


function loadCachedData(player) {
    let pos_data = global.treePosMetadata(player, player)
    if (!pos_data) {
        return
    } else {
        global.pos_data = pos_data
    }
    
    let forest_name = pos_data.normalized_world_name
    if (!forest_name) {
        forest_name = getMcWorld(player)
    }
    global.trees_database = loadTreeData(player, `${forest_name}TreesDatabase`)
    global.forest_book = loadManagementBook(player, forest_name)
    global.forest_management = loadConfigData(player, "forest_management")
    global.server_date = initServerDate(player)
}


function saveCachedData(player) {
    let pos_data = global.treePosMetadata(player, player)
    let forest_name = pos_data.normalized_world_name
    if (!forest_name) {
        forest_name = getMcWorld(player)
    }
    if (!global.trees_database.trees || Object.keys(global.trees_database.trees).length === 0) {
        console.info(" [SAVE] No data loaded")
        return false
    } else {
        saveTreeData(player, `${forest_name}TreesDatabase`, global.trees_database)
        saveTreeData(player, `${forest_name}TreesDatabase_back`, global.trees_database)
        saveManagementBook(player, forest_name, global.forest_book)
        saveServerDate(player)
        console.info("Bases de données sauvegardées")
        return true
    }
}



