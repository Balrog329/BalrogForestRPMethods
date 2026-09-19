

// gmask racines DT
const GMASK_ROOTY = '/gmask >' +
    'dynamictrees:rooty_grass_block,' +
    'dynamictrees:rooty_dirt,' +
    'dynamictrees:rooty_podzol,' +
    'dynamictrees:rooty_coarse_dirt,' +
    'dynamictrees:rooty_rooted_dirt,' +
    'dynamictrees:rooty_gravel,' +
    'dynamictrees:rooty_moss_block,' +
    'dynamictrees:rooty_moss';




const BrushRegistry = {
    'brushCutConiferous': brushCutConiferous,
    'brushCutBroadleaf':brushCutBroadleaf,
    'brushClearing':brushClearing,
    'brushGrinding':brushGrinding,
    'soilPreparation':soilPreparation,
    'brushTripwirePath':brushTripwirePath,
    'brushCutCustomConiferous':brushCutCustomConiferous,
    'brushCutCustomDecidious':brushCutCustomDecidious
}


function setBrush(player, radius, funcName) {
    BrushRegistry[funcName](player, radius)

}

// supprime les arbres resineux dt
function brushCutConiferous(player, radius) {
    player.runCommandSilent('gmask');
    player.runCommandSilent(`/br s minecraft:air ${radius}`);

    player.runCommandSilent(
        'mask ' +
        'dynamictrees:spruce_branch,' +
        'dtru:blackwood_branch,' +
        'dtbop:fir_branch,' +
        'dtbop:redwood_branch,' +
        'dtru:pine_branch,' +
        'dynamictrees:jungle_leaves,' +
        'dynamictrees:jungle_branch,' +
        'dtterralith:moonlight_branch,' +
        'dtru:larch_branch,' +
        'dtbwg:fir_branch,' +
        'dtbwg:pine_branch'
    );

    player.runCommandSilent(GMASK_ROOTY);
    messageChat(player, 'Brush : suppression des résineux définie');
}

// coupe d'arbre custom
function brushCutCustomConiferous(player, radius) {
    player.runCommandSilent('gmask');
    player.runCommandSilent(`/br s minecraft:air ${radius}`);

    player.runCommandSilent(
        'mask ' +
        'biomeswevegone:holly_log,' +
        'biomeswevegone:holly_wood,'+
        'biomeswevegone:holly_leaves,'+
        'minecraft:spruce_leaves,'+
        'minecraft:spruce_fence,'+
        'minecraft:spruce_fence_gate,'+
        'minecraft:spruce_leaves,'+
        'minecraft:spruce_wood,'+
        'minecraft:spruce_log,'+
        'minecraft:nether_brick_stairs,'+
        'biomesoplenty:fir_leaves,'+
        'biomesoplenty:fir_fence,'+
        'biomesoplenty:fir_log,'+
        'biomesoplenty:fir_wood,'+
        'biomesoplenty:fir_fence_gate,'+
        'biomeswevegone:fir_log,'+
        'biomeswevegone:fir_wood,'+
        'regions_unexplored:blackwood_leaves,'+
        'biomeswevegone:rocky_stone_wall,'+
        'biomeswevegone:fir_fence,'+
        'biomeswevegone:fir_fence_gate'
    );

    messageChat(player, 'Brush : suppression des résineux définie');

}

// supr des arbre sfeuillis custom
function brushCutCustomDecidious(player, radius) {
    player.runCommandSilent('gmask');
    player.runCommandSilent(`/br s minecraft:air ${radius}`);

    player.runCommandSilent(
        'mask ' +
        'minecraft:oak_log,'+
        'minecraft:oak_leaves,'+
        'minecraft:oak_wood,'+
        'minecraft:oak_fence,'+
        'minecraft:birch_leaves,'+
        'minecraft:birch_fence,'+
        'minecraft:birch_fence_gate,'+
        'minecraft:birch_wood,'+
        'minecraft:birch_log,'+
        'minecraft:acacia_leaves,'+
        'minecraft:acacia_fence,'+
        'minecraft:dark_oak_leaves,'+
        'minecraft:dark_oak_fence,'+
        'minecraft:dark_oak_wood,'+
        'minecraft:dark_oak_log,'+
        'minecraft:sandstone_wall,'+
        'minecraft:nether_brick_wall'

    )

    messageChat(player, 'Brush : suppression des résineux définie');

}



function brushCutBroadleaf(player, radius) {
    player.runCommandSilent('gmask');
    player.runCommandSilent(`/br s minecraft:air ${radius}`);

    player.runCommandSilent(
        'mask ' +
        'dynamictrees:oak_leaves,' +
        'dynamictrees:oak_branch,' +
        'dynamictrees:birch_leaves,' +
        'dynamictrees:birch_branch,' +
        'dynamictrees:mangrove_branch,' +
        'dtru:maple_branch,' +
        'dynamictrees:dark_oak_branch,' +
        'dynamictrees:cherry_branch,' +
        'dynamictrees:acacia_branch,' +
        'dtbop:willow_branch'
    );

    player.runCommandSilent(GMASK_ROOTY);
    messageChat(player, 'Brush : suppression des feuillus définie');
}

function brushClearing(player, radius) {
    player.runCommandSilent(`/br s regions_unexplored:medium_grass,0 ${radius}`);
    player.runCommandSilent('gmask')

    player.runCommandSilent(
        'mask ' +
        'fern,large_fern,grass,tall_grass,' +
        'dynamictrees:birch_branch,' +
        'dynamictrees:flowering_azalea_leaves,' +
        'dynamictrees:azalea_leaves,' +
        'sweet_berry_bush,azalea_leaves,' +
        'spruce_fence,acacia_leaves,birch_leaves,' +
        'framedblocks:framed_slab,'+
        'stripped_oak_log,'+
        'dynamictrees:oak_branch,'+
        'dynamictrees:oak_leaves,'+
        'dynamictrees:birch_branch,'+
        'dynamictrees:birch_leaves,'+
        'dynamictrees:acacia_branch,'+
        'dynamictrees:acacia_leaves,'+
        'moss_carpet'

    );

    messageChat(player, 'Dégagement défini');
}

function brushGrinding(player, radius) {
    player.runCommandSilent(`/br s 0 ${radius}`);

    player.runCommandSilent(
        'mask rooted_dirt,podzol,coarse_dirt,stripped_spruce_log,' +
        'biomesoplenty:stripped_fir_log,regions_unexplored:pine_log,' +
        'framedblocks:framed_slab,2'
    )

    messageChat(player, 'Broyage défini');
}

function soilPreparation(player, radius) {
    player.runCommandSilent('/br s 50%dirt,35%rooted_dirt,15%podzol '+ radius);
    player.runCommandSilent('mask coarse_dirt,podzol,moss_block,grass_block');
    messageChat(player, 'Préparation de sol définie');
}


function brushTripwirePath(player, radius) {
    player.runCommandSilent('/br s tripwire 1');

    player.runCommandSilent(
        'mask >rooted_dirt,podzol,2,coarse_dirt,dirt_path,moss_block'
    );

    messageChat(player, 'Pose de tripwire définie');
}
