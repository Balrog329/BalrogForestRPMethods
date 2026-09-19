


PlayerEvents.loggedIn(event => {
    let player = event.player
    global.forestInfo(player)

    if (!global.entities[player.username]) {
        newEntities(player.username, "player", player.username)
    }
    messageChat(player, player.username + 'a rejoint la partie')
})


PlayerEvents.loggedOut(event => {
    const player = event.player
    console.info(`${player.username} was quit the game`)
    messageChat(player, player.username + 'a quitter la partie')
    saveCachedData()
    console.info("Database is save")
})