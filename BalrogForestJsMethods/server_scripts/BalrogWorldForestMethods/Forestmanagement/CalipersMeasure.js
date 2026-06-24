

function measureTree(player, tree_data, pos, tree_database) {
    let tree_config_data = loadConfigData(player, "speciesdata")[tree_data.tree_species]

    let id = `${getTreePositionStr(tree_data)}_${tree_data.volume_total}`

    let tree_logs_segments = getTreeLogSegments(tree_data, tree_config_data)
  
    let height = tree_logs_segments.length
    if (height == 0) {return}
    
    let quality = getScoreboardValue(player, "qlt")
    if (quality == 0) {
        quality = tree_config_data.default_quality
    }

    let radius = getTreeBaseRadius(tree_data);
    let log_volume = getLogVolume(tree_logs_segments);
    let energy_volume = getEnergyVolume(tree_data.branch, tree_logs_segments, tree_config_data.min_count_radius)

    tree_database.trees[id] = {
        species: tree_data.tree_species,
        radius: radius,
        height: height,
        quality: quality,
        vol1: log_volume,
        vol2: energy_volume,
        forest: pos.normalized_world_name,
        parcel: pos.parcel,
        owner: pos.owner,
        posx: tree_data.x,
        posy: tree_data.y,
        posz: tree_data.z
    }

    resetScoreboard(player, "qlt")

    messageChat(player, `${tree_data.tree_species} ; ${radius} x ${height} qlt : ${quality}, vol1 : ${log_volume} m³, vol2 : ${energy_volume} m³`)

    saveTreeData(player, `${pos.normalized_world_name}TreeDatabase`, tree_database)

    return id
}