
/**
 * Permet de poser des souches sur les sousche de l'ancienne méthode
 */

function addStump(player, radius) {
    const forest_blocks = ["minecraft:dirt", "minecraft:rooted_dirt", "minecraft:podzol"]
    let positions = findBlock(
        player,
        player.getBlock().x,
        player.getBlock().y,
        player.getBlock().z,
        radius,
        ["minecraft:stripped_spruce_log"])

    for (let pos of positions) {
        let forest_block = forest_blocks[Math.floor(Math.random() * 3 -1)]
        let tree_data = {}
        tree_data.radius = Math.floor(Math.random() * 8)
        tree_data.posx = pos.x
        tree_data.posy = pos.y
        tree_data.posz = pos.z
        setStump(player.level, player, "stripped_spruce_log", tree_data)
        player.runCommandSilent(`setblock ${pos.x} ${pos.y} ${pos.z} ${forest_block}` )
    }
}