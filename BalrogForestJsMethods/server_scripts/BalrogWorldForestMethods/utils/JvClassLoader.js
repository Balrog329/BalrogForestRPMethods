
function getContextClass(player){
    return Java.loadClass('com.balrogforestjv.balrogforestjv.ServerContext').setServerLevel(player.level);
}


function callTreeScanner(block_pos){
    return Java.loadClass('com.balrogforestjv.balrogforestjv.TreeScanner').scanTree(block_pos)
}

