
global.globgetMcWorld = function(player) {
    return getMcWorld(player)
}

global.globgetMcDimension = function(player) {
    return getMcDimension(player)
}

global.globmessageChat = function(player, message) {
    return messageChat(player, message)
}

global.globgetBlockId = function(block) {
    return getBlockId(block)
}

global.globgetItemId = function(item) {
    return getItemId(item)
}

global.globloadTreeData = function(player, json_name) {
    return loadTreeData(player, json_name )
}

global.globgetLotId = function(pos_data) {
    return getLotId(pos_data)
}