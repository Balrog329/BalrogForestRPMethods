



let counter = 0

ServerEvents.tick(event => {

    counter++

    const server = event.server

    server.players.forEach(player => {
        global.player = player
    })

    if (counter == 1200) {
        server.players.forEach(player => {
            saveCachedData()
        })
    }

    if (counter < 6000) {return}

    counter = 0

    server.players.forEach(player => {

            if (getMcDimension(player) !== "minecraft:overworld") {return}

            summonEntity(server, player)

    })

})
