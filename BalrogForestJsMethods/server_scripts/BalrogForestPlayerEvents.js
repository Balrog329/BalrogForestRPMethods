
PlayerEvents.loggedIn(event => {
    let player = event.player
    let world_name = getMcWorld(player)
    serverInit(player)
    
    global.forestInfo(player)
})


PlayerEvents.loggedOut(event => {
    const player = event.player
    console.info(`${player.username} was quit the game`)
    saveCachedData(player)
    console.info("Database is save")
})