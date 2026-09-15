

global.getServerContext = function() {
    const ServersData = global.server_registry.serversregistry || {}

    const serverName = Utils.server.getWorldData().getLevelName()
    const normalized_serverName = parseMcWorld(serverName)

    const mcDir = Utils.server.getServerDirectory().getAbsolutePath()
    const serversPath = mcDir + '/saves'

    const serverData = ServersData[normalized_serverName] || {}

    const serverDir = `${serversPath}/${serverData.world_dir ?? serverName}`
    const balrogdataDir = `${serverDir}/balrogdata`

    return {
        serverName: serverName,
        normalized_serverName: normalized_serverName,
        mcDir: mcDir,
        offline_time_coef: serverData.offline_time_coef ?? 0,
        serversPath: serversPath,
        serverDir: serverDir,
        balrogdataDir: balrogdataDir,
        claim: serverData.isclaim ?? false,
        proprietiesInServer: serverData.proprietiesInServer ?? {}
    }
}


function getserverProprietiesArray() {

    let all_proprieties = []

    for (let proprieties in global.getServerContext().proprietiesInServer) {
        all_proprieties.push(proprieties)
    }
    return all_proprieties
}


function getAllProprietiesParcel(proprieties) {

    let parcels = []
    for (let polygons of global.geo_polygons.features) {
        let props = polygons.properties || {}

        if (props.forest === proprieties){
            let parcel = props.name1
           parcels.push(parcel)
        }
    }
    return parcels
}

function getNumProprietiesParcel(propieties) {

    let raw = getAllProprietiesParcel(propieties)
    let out = []
    let seen = {}

    for (let i = 0; i < raw.length; i++) {
        let p = String(raw[i])
        let num = p.split(".")[0]

        if (!seen[num]) {
            seen[num] = true
            out.push(num)
        }
    }

    out.sort(function(a, b) {
        return Number(a) - Number(b)
    })

    return out
}



function newProprety(name, owner, referent_manager) {
    let start_current_mdoc = global.server_date.year
    let end_current_mdoc = start_current_mdoc +=15

    global.forest_management[parseMcWorld(name)] = {
        name_id: name,
        id: Math.max.apply(null, Object.values(global.forest_management).map(f => Number(f.id))) + 1,
        world_name: global.getServerContext().serverName,
        world_dir: global.getServerContext().serverDir,
        normalized_world_name: parseMcWorld(name),
        Surface: 0,
        owner: owner,
        referent_manager: referent_manager,
        current_year: global.server_date.year,
        start_current_mdoc: start_current_mdoc,
        end_current_mdoc: end_current_mdoc
    }
    global.server_registry.serversregistry[global.getServerContext().normalized_serverName].proprietiesInServer[parseMcWorld(name)] = parseMcWorld(name)
    global.entities[owner].properties[parseMcWorld(name)] = parseMcWorld(name)
    messageChat(Utils.server, '§b-> Nouvelle propriété créée : ' + name)
    saveCachedData()
}

function buyProperty(property, buyer, referent_manager, amount) {

    let world = parseMcWorld(property)
    let forest = global.forest_management[world]

    let old_owner = forest.owner

    // transaction
    transaction(buyer, old_owner, amount)

    // mise à jour du propriétaire
    forest.owner = buyer
    forest.referent_manager = referent_manager

    // ajout au nouveau propriétaire
    global.entities[buyer].properties[property] = property

    // suppression chez l'ancien propriétaire
    if (global.entities[old_owner] && global.entities[old_owner].properties) {
        delete global.entities[old_owner].properties[property]
    }

    messageChat(Utils.server, "Propriété vendue : " + property)
    saveCachedData()
}
