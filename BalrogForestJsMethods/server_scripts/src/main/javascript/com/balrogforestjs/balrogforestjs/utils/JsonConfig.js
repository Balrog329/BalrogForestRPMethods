
function getConfigjsonFile(json_name) {
    return 'kubejs/config/balrogforestconfig/'+ json_name + '.json'
}

function loadConfigData(json_name) {
    return JsonIO.read(getConfigjsonFile(json_name))
}

function saveConfigFile(json_name, data) {
    return JsonIO.write('kubejs/config/balrogforestconfig/'+ json_name + '.json', data)
}




