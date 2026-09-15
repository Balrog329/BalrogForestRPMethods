
function getConfigjsonFile(json_name) {
    return 'kubejs/config/balrogforestconfig/'+ json_name + '.json'
}

function loadConfigData(json_name) {
    return JsonIO.read(getConfigjsonFile(json_name))
}

function loadGlobalData(json_name) {
    return JsonIO.read('kubejs/data/entities/' + json_name + '.json')
}

function saveGlobalData(json_name, data) {
    return JsonIO.write('kubejs/data/entities/' + json_name + '.json', data)
}

function getDataFile(json_name) {
    return `kubejs/data/${json_name}.json`
}


function loadTreeData(json_name) {
    const file = getDataFile(json_name)

    return JsonIO.read(file) || {
        server: global.getServerContext().serverName,
        trees: {}
    }
}

function loadLotData(json_name) {
    const file = getDataFile(json_name);
    return JsonIO.read(file) || {
        server: global.getServerContext().serverName,
        lots: {}
    }
}

function saveTreeData(json_name, data) {
    console.info(`[SAVE] ${json_name}`)
    const file = getDataFile(json_name)
    JsonIO.write(file, data)
}



function loadmarkedData(json_name) {

    const file = getDataFile(json_name)

    return JsonIO.read(file) || {
        server: global.getServerContext().normalized_serverName,
        marked: {
            trees: {}
        }
    }
}

function loadFrontierData(frontier_name){
    return JsonIO.read(getFrontierFile(frontier_name)) || {}
}

function getFrontierFile(json_name) {
    return `kubejs/data/frontiers/${json_name}.geojson`
}

function loadManagementBook() {

    const file = 'kubejs/data/' + global.getServerContext().normalized_serverName + '_management_book.json'

    return JsonIO.read(file) || {
        forest: global.getServerContext().normalized_serverName,
        book: {}
    }
}

function saveManagementBook(data) {
    const file = 'kubejs/data/' + global.getServerContext().normalized_serverName + '_management_book.json'
    console.info(`[SAVE] ${file}`)
    JsonIO.write(file, data)

}

function saveConfigFile(json_name, data) {
    return JsonIO.write('kubejs/config/balrogforestconfig/'+ json_name + '.json', data)
}




