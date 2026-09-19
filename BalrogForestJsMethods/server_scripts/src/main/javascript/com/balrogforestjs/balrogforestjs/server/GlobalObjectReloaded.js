
// Stockage des configs en cache et autre redéfinit au /reload

globalObjectReloaded()

function globalObjectReloaded() {

    global.server_registry = loadConfigData("serversregistry")
    global.blue_mark_type = "futur"
    global.species_config = loadConfigData("species_config")
    global.cost_and_taxes = loadConfigData("cost_and_taxe")
    global.calendar = loadConfigData("calendar")
    global.frontiers = readFrontiersDat()
    messageChat(Utils.server, '§a[BF] Config mis en cache !')
}