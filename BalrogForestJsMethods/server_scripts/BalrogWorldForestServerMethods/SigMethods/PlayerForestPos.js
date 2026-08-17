global.player_cache = {}


global.updatePlayerForestPos = function() {
    const player = global.player

    const uuid = player.uuid.toString()
    const pos = player.blockPosition()

    let cache = global.player_cache[uuid]

    if (!cache) {
        cache = global.player_cache[uuid] = {
            last_pos: { x: pos.x, y: pos.y, z: pos.z },
            cached_data: global.treePosMetadata(player, pos)
        }

        return cache.cached_data
    }

    if (cache.last_pos.x === pos.x && cache.last_pos.z === pos.z) {
        return cache.cached_data
    }

    cache.last_pos = { x: pos.x, y: pos.y, z: pos.z }
    //if (getPolygonNames(player, pos.x, pos.z ) === )
    const new_data = global.treePosMetadata(player, pos)
    console.info(new_data)
    if (new_data === cache.cached_data) {
        return cache.cached_data}

    cache.cached_data = new_data

    return new_data
}
