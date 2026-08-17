ClientEvents.tick(event => {
    let player = event.player
    let itemId = global.getHandItem(player)
    // Vérifications générales
    if (!global.current_wood_lot || global.current_wood_lot == "None") {return}

    if (itemId === "immersiveengineering:hammer") {

        let ui = uiLotText(player, global.current_wood_lot)
    } else {
            _clearUiLot(player)
        }
})