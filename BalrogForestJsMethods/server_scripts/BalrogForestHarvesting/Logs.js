var soil = [
    "minecraft:rooted_dirt",
    "minecraft:grass_block",
    "minecraft:podzol",
    "minecraft:gravel",
    "minecraft:dirt_path",
    "minecraft:gravel",
    "minecraft:coarse_dirt"
]



function setLogPile(player, log_emprise, species) {
    const species_config = loadConfigData(player, "speciesdata")[species]
    let positions = findBlock(player, player.getBlock().x, player.getBlock().y, player.getBlock().z, log_emprise, soil)
    for (let pos of positions) {
        let log = species_config.log_block
        console.info(log)
        //player.runCommand(`setBlock`)
    }
}