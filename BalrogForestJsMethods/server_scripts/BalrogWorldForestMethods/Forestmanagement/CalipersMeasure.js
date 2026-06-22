function measureTree(player, block, species, pos) {

    let forest_name = pos.normalized_world_name
    let tree_config_data = loadConfigData(player, "speciesdata")[species]

    let radius = getTreeRadius(block)
    if (radius < tree_config_data.min_count_radius) {return}

    let diameter = radius *2

    let tree_pos = getTreePositionRaw(block)

    let height = getScoreboardValue(player, "height")

    if (height == 0) {
        height = getTreeLogHeight(player, block, tree_pos, diameter, tree_config_data)
    }

    resetScoreboard(player, "height")

    let quality = getScoreboardValue(player, "qlt")

    if (quality == 0) {
        quality = tree_config_data.default_quality
    }

    resetScoreboard(player, "qlt")

    messageChat(player, `${species} ; ${diameter} x ${height} qlt : ${quality}`)

    let id = addTree(player, block, `${forest_name}_trees_database`, species, diameter, height, quality, tree_pos, pos)
    
    return id

}