
// Stockage des configs en cache et autre redéfinit au /reload

globalObjectReloaded()

function globalObjectReloaded() {
    //global.entities = loadGlobalData("entities")
    //global.entities = loadEntitiesDat("entities")
    global.server_registry = loadConfigData("serversregistry")
    //global.forest_management = loadConfigData("forest_management")
    global.blue_mark_type = "futur"
    global.species_config = loadConfigData("species_config")
    global.cost_and_taxes = loadConfigData("cost_and_taxe")
    global.calendar = loadConfigData("calendar")
    global.geo_polygons = loadFrontierData(global.getServerContext().normalized_serverName + '_ug')
    messageChat(Utils.server, '§a[BF] Config mis en cache !')
}