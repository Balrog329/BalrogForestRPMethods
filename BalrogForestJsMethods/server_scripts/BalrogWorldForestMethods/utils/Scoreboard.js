
function getScoreboardValue(player, sb_name){
    let player_name = player.username

return player.runCommandSilent(`scoreboard players get ${player_name} ${sb_name}`)

}

function enabledScoreboard(player, sb_name) {
    let player_name = player.username
    player.runCommandSilent(`scoreboard players enable ${player_name} ${sb_name}`)
}

function setScoreboardValue(player, sb_name, value) {
    player.runCommandSilent(`trigger ${sb_name} set ${value}`)
}

function createScoreboard(player, sb_name) {
    player.runCommandSilent(`scoreboard objectives add ${sb_name} trigger`)
}


function resetScoreboard(player, sb_name) {
    enabledScoreboard(player, sb_name)
    setScoreboardValue(player, sb_name, 0)
    enabledScoreboard(player, sb_name)
}
