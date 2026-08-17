
function setDtStump(level, player, species, stump_block, tree_data) {

    level.server.scheduleInTicks(40, callback => {
        player.runCommandSilent(`setblock ${tree_data.posx} ${tree_data.posy + 2} ${tree_data.posz} minecraft:air`)
        player.runCommandSilent(`setblock ${tree_data.posx} ${tree_data.posy + 1} ${tree_data.posz} ${stump_block}[radius=${tree_data.radius}]`)
    })
}



function setStump(level, player,  stump_block, tree_data) {

    let block

    if (tree_data.radius <=5) {
        block = 'framedblocks:framed_mini_cube'
    } else {
        block = 'framedblocks:framed_slab'
    }

    level.server.scheduleInTicks(50, callback => {

        player.runCommandSilent(`setblock ${tree_data.posx} ${tree_data.posy + 1} ${tree_data.posz} ${block}`)

        level.getBlock(BlockPos(tree_data.posx, tree_data.posy + 1, tree_data.posz)).setEntityData({
        camo: {state: {Properties: {axis: "y"},Name: stump_block}, type: "framedblocks:block"}, 
        updated: 3
        })
    })
}