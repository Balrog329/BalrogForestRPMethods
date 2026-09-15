

function loadChunk(type, posx, posz) {
    Utils.server.runCommandSilent(`forceload ${type} ${posx} ${posz}`)
}


