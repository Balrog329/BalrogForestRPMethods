function getLotId(player, pos_data) {
    let year = getScoreboardValue(player, "year")
    let lot_num = getScoreboardValue(player, "lot_id")

    return `${pos_data.id}_${pos_data.parcel}_${year}_${lot_num}`
}

function getLot(player, pos_data) {

    let year = getScoreboardValue(player, "year")
    let lot_num = getScoreboardValue(player, "lot_id")

    let json_name = `${pos_data.normalized_world_name}LotDatabase`

    let database = loadTreeData(player, json_name)

    if (!database.lots) {
        database.lots = {}
    }

    let lotId = getLotId(player, pos_data)

    if (!database.lots[lotId]) {

        database.lots[lotId] = {
            id: lotId,

            forest_id: pos_data.id,
            parcel: pos_data.parcel,

            year: year,
            lot_num: lot_num,

            owner: pos_data.owner,

            volume1: 0,

            volume2: 0,

            trees: {}
        };

        saveTreeData(player, json_name, database);
    }

    return {
        json_name: json_name,
        database: database,
        lot: database.lots[lotId]
    };
}

/**
 * Recalcule le volume total (bois d'œuvre et bois-énergie) d'un lot
 * à partir de la liste de ses arbres enregistrés.
 * @param {object} player - Le joueur
 * @param {object} pos_data - Les données de position 
 * @param {object} lot - L'objet lot à mettre à jour
 */
function calculLotVolume(player, tree_database, lot) {
    //tree_database est la base de données de l'arbre propre pas de touts les arbres
    let trees_database = loadTreeData(player, `${tree_database.forest}TreeDatabase` )

    let total_vol1 = 0
    let total_vol2 = 0

    for (let tree_id in lot.trees) {

        let tree_data = trees_database.trees[tree_id]
        total_vol1 += Number(tree_data.vol1)
        total_vol2 += Number(tree_data.vol2)
    }

    lot.volume1 = Number(total_vol1.toFixed(4))
    lot.volume2 = Number(total_vol2.toFixed(4))

    return total_vol1
}