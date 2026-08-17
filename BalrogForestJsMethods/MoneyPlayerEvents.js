PlayerEvents.loggedIn(event => {
    const player = event.player

    global.player = player
    global.world_name = getMcWorld(player)
    global.legals_entities_path = "kubejs/config/data/MoneyData/legals_entities.json"
})
