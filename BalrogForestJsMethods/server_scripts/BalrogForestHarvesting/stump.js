
function setDtStump(player, species, stump_block, tree_data) {

    player.server.scheduleInTicks(40, callback => {
        Utils.server.runCommandSilent(`setblock ${tree_data.posx} ${tree_data.posy + 2} ${tree_data.posz} minecraft:air`)
        Utils.server.runCommandSilent(`setblock ${tree_data.posx} ${tree_data.posy + 1} ${tree_data.posz} ${stump_block}[radius=${tree_data.radius}]`)
    })
}



function setStump(player, stump_block, tree_data) {

    let block

    if (tree_data.radius <=5) {
        block = 'framedblocks:framed_mini_cube'
    } else {
        block = 'framedblocks:framed_slab'
    }

    player.server.scheduleInTicks(50, callback => {

        Utils.server.runCommandSilent(`setblock ${tree_data.posx} ${tree_data.posy + 1} ${tree_data.posz} ${block}`)

        Utils.server.getLevel("minecraft:overworld").getBlock(BlockPos(tree_data.posx, tree_data.posy + 1, tree_data.posz)).setEntityData({
        camo: {state: {Properties: {axis: "y"},Name: stump_block}, type: "framedblocks:block"}, 
        updated: 3
        })
    })
}