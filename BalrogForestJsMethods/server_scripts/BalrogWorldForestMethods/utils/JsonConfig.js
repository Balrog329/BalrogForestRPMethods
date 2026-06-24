
function getConfigjsonFile(player, json_name) {
    return `kubejs/config/${json_name}.json`
}

function loadConfigData(player, json_name) {
    const file = getConfigjsonFile(player, json_name)

    return JsonIO.read(file)
}



function getTreeFile(player, json_name) {
    return `kubejs/data/${json_name}.json`
}

function loadTreeData(player, json_name) {
    const file = getTreeFile(player, json_name)

    return JsonIO.read(file) || {
        forest: getMcWorld(player),
        trees: {}
    }
}


function saveTreeData(player, json_name, data) {
    const file = getTreeFile(player, json_name)
    JsonIO.write(file, data)
}


function loadlotData(player, forest_name, json_name) {

    const file = getTreeFile(player, json_name)

    return JsonIO.read(file) || {
        forest_name: {}
        
    }
}

function loadmarkedData(player, forest_name, json_name) {

    const file = getTreeFile(player, json_name)

    return JsonIO.read(file) || {
        forest: forest_name,
        marked: {
        trees: {}
        }
    }
}

function loadFrontierData(player, frontier_name){
    const file = getFrontierFile(player, frontier_name)
    return JsonIO.read(file)
}

function getFrontierFile(player, json_name) {
    return `kubejs/data/frontiers/${json_name}.json`
}
