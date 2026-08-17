
function uiLotText(player, lot_id) {
    let json_name = `${global.pos_data.normalized_world_name}LotDatabase`

    let database = global.globloadTreeData(player, json_name).lots[lot_id]

    player.paint({
        lot_id: _uiLotUtils(`Lot : ${database.id}`, 50),
        lot_cut_type: _uiLotUtils(`Type : ${database.cut_type}`, 60),
        lot_year: _uiLotUtils(`Année : ${database.year}`, 70),
        lot_nb_trees: _uiLotUtils(`Nombre d'arbres : ${database.trees_number}`, 80),
        lot_mean_vol1: _uiLotUtils(`Volume unitaire moyen ${database.trees_mean_vol1} m3`, 90),
        lot_volume: _uiLotUtils(`BO : ${database.volume1} m3`, 100),
        lot_volume2: _uiLotUtils(`BE : ${database.volume2} m3`, 110)
    })

}
function _uiLotUtils(text, y_number){
    return {
        type: 'text',
        text: text,
        x: Number(0),
        y: Number(y_number),
        scale: Number(1.0),
        alignX: 'right',
        alignY: 'center',
        draw: 'ingame'
    }
}

function _clearUiLot(player) {
    player.paint({
        lot_id: _uiLotUtils('', 50),
        lot_cut_type: _uiLotUtils('', 60),
        lot_year: _uiLotUtils('', 70),
        lot_nb_trees: _uiLotUtils('', 80),
        lot_mean_vol1: _uiLotUtils('', 90),
        lot_volume: _uiLotUtils('', 100),
        lot_volume2: _uiLotUtils('', 110)
    })
}