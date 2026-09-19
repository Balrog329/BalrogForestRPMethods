
BlockEvents.broken(event => {
    if (global.getServerContext().claim === false) {
        return
    }
    claimProprieties(event)
})

BlockEvents.leftClicked(event => {
    if (global.getServerContext().claim === false) {
        return
    }
    claimProprieties(event)
})

BlockEvents.rightClicked(event => {
    if (global.getServerContext().claim === false) {
        return
    }
    claimProprieties(event)
})


function claimProprieties(event){
    const testPolygon = getDatPolygonNames(event.player.x, event.player.z)
    if (!testPolygon) {return false}

    if (getClaimProprietiesPermission(event.player) === false) {
        messageChat(event.player, "§cVous n'avez pas les droit sur cette propriété")
        event.cancel()
        return false
    }
    return true
}

function getClaimProprietiesPermission(player) {
    const pos_data = global.proprieties[global.resolveForestNameByPos(player.x, player.z)]

    if (player.username === pos_data.owner ) {
        return true
    }

    return player.username === pos_data.referent_manager;



}