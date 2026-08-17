

function loadChunk(player, type, posx, posz) {
    player.runCommandSilent(`forceload ${type} ${posx} ${posz}`)
}


