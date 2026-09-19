const CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag")

// à utiliser que depuis le tree_data du global pas depuis la classe java
function getTreeId(tree_data) {
    return `${tree_data.posx}_${tree_data.posz}_${tree_data.volume_total}`
}


function  removeTree(tree_id) {
    delete global.trees_database.trees[tree_id]
}

function addTrees(id, species, radius, height, quality, tree_data, vol1, vol2, forest, parcel, owner) {
    global.trees_database.trees[id] = {
        measurement_date: global.server_date.year,
        species: species,
        radius: radius,
        height: height,
        quality: quality,
        is_dead: tree_data.is_dead,
        vol1: vol1,
        vol2: vol2,
        forest: forest,
        parcel: parcel,
        owner: owner,
        posx: tree_data.x,
        posy: tree_data.y,
        posz: tree_data.z
    }
    return id
}


function addDatTrees(id, species, radius, height, quality, tree_data, vol1, vol2, forest, parcel, owner) {
    const trees = global.trees_database.getCompound("trees")
    const tree = new CompoundTag()

    tree.putInt("measurement_date", global.server_date.year)
    tree.putString("species", species)
    tree.putInt("radius", radius)
    tree.putInt("height", height)
    tree.putInt("quality", quality)
    tree.putBoolean("is_dead", tree_data.is_dead)
    tree.putDouble("vol1", vol1)
    tree.putDouble("vol2", vol2)
    tree.putString("forest", forest || "public")
    tree.putInt("parcel", parcel || "public")
    tree.putString("owner", owner)
    tree.putInt("posx", tree_data.x)
    tree.putInt("posy", tree_data.y)
    tree.putInt("posz", tree_data.z)

    trees.put(id, tree)

    return id
}