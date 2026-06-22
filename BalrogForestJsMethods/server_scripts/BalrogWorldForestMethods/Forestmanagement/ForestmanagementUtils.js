
function getSpecies(species_id) {

    let mod = species_id.split(":")[0]
    let species_name = species_id.split(":")[1].split("_branch")[0]
    return "species" + "." + mod + "." + species_name
}

function getTreeRadius(block) {
    let radius = block.properties.get("radius")
    return radius
}

function getTreeLogHeight(player, block, tree_pos, radius, config) {

    if (radius < config.min_log_radius) return 0

    let base = findTreeBase(player, tree_pos)
    let height = 0
    let maxHeight = 50

    while (height < maxHeight) {

        let pos = {
            x: tree_pos.x,
            y: base.y + height + 1,
            z: tree_pos.z
        }

        let block_sup = getBlock(player, pos)

        if (!isLog(block_sup)) break
        if (getTreeRadius(block_sup) < config.min_log_radius) break

        height++
    }

    return height
}



function getBlock(player, pos) {
    return player.level.getBlock(pos.x, pos.y, pos.z)
}


function isLog(block) {
    if (!block) return false
    return block.id.includes("branch")
}


function findTreeBase(player, pos) {
    let y = pos.y

    while (y > 0) {
        let b = player.level.getBlock(pos.x, y - 1, pos.z)

        if (!isLog(b)) break

        y--
    }

    return { x: pos.x, y: y, z: pos.z }
}


function getTreePositionStr(block) {
    return `${block.x} ${block.z}` 
}

function getTreePositionRaw(block) {
    return {
        x: block.x,
        y: block.y,
        z: block.z
    }
}


function addTree(player, block, table_name, species, diameter, height, quality, tree_pos, pos) {

    let data = loadTreeData(player, table_name)

    let id = getTreePositionStr(block)

    data.trees[id] = {
        species: species,
        diameter: diameter,
        height: height,
        quality: quality,
        parcel: pos.parcel,
        owner: pos.owner,
        posx: tree_pos.x,
        posy: tree_pos.y,
        posz: tree_pos.z
        
    }

    saveTreeData(player, table_name, data)

    return id

}

function findTreePosMark(player, block, mark_config) {

    for (let key in mark_config.marks) {

        let mark = mark_config.marks[key]

        let dx = mark.offset[0]
        let dy = mark.offset[1]
        let dz = mark.offset[2]

        addTreeMark(player, `${block.x + dx} ${block.y + dy} ${block.z + dz}`,mark.block)
    }
}

function addTreeMark(player, pos, blockId) {
    player.runCommandSilent(`setblock ${pos} ${blockId} replace`)
}