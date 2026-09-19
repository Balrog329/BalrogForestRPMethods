
function getMcDimension(player) {
    return String(player.level.dimension)
}

function getMcWorld(player) {
    return parseMcWorld(String(player.level).split("[")[1].split("]")[0])
}

function parseMcWorld(world){
    return world.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "_")
}
// entities = Utils.server ou player
function messageChat(entities, message) {
    if (!entities) return
    entities.tell(message)
}

function getBlockId(block) {
    return block.id
}

function getItemId(item) {
    return item.id
}



