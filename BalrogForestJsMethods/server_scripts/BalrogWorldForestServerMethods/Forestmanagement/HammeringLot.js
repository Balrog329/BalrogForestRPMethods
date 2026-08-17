function getLotId(pos_data, lot_id) {
    if (!lot_id) {return}
    return `${pos_data.id}_${pos_data.year}_${lot_id}`
}

function getLot(player, pos_data, lot_id) {

    let json_name = `${pos_data.normalized_world_name}LotDatabase`
    let database = loadLotData(player, pos_data.normalized_world_name, json_name)

    if (!database.lots[String(pos_data.year)]) {
        database.lots[String(pos_data.year)] = {}
    }

    if (!database.lots[String(pos_data.year)][lot_id]) {return}
    
    return {
        json_name: json_name,
        database: database,
        lot: database.lots[String(pos_data.year)][lot_id]
    }
}

function createNewLot(player, pos_data, cut_type_key, lot_id) {
    console.info(`[BWFM] Création d'un nouveau lot : ${lot_id} (${cut_type_key})`)
    let new_lot_id = getLotId(pos_data, lot_id)
    let json_name = `${pos_data.normalized_world_name}LotDatabase`
    let database = loadLotData(player, pos_data.normalized_world_name, json_name)

    if (!database.lots[new_lot_id]) {
        database.lots[new_lot_id] = {}
    }

    database.lots[new_lot_id] = {
        
        forest_name: pos_data.normalized_world_name,
        id: new_lot_id,

        forest_id: pos_data.id,
        cut_type: cut_type_key,

        year: pos_data.year,

        owner: pos_data.owner,
        referent_manager: pos_data.referent_manager,

        trees_number: 0,
        trees_mean_vol1: 0,
        volume1: 0,

        volume2: 0,

        trees: {}
    }

    saveTreeData(player, json_name, database)

    return database.lots[new_lot_id]
}

/**
 * Recalcule le volume total (bois d'œuvre et bois-énergie) d'un lot
 * à partir de la liste de ses arbres enregistrés.
 * @param {object} player - Le joueur
 * @param {object} pos_data - Les données de position 
 * @param {object} lot - L'objet lot à mettre à jour
 */
function calculLotVolume(player, lot) {

    let total_vol1 = 0
    let total_vol2 = 0
    for (let tree_id in lot.trees) {
        let tree_data = global.trees_database.trees[tree_id]
        
        total_vol1 += Number(tree_data.vol1)
        total_vol2 += Number(tree_data.vol2)
    }

    lot.volume1 = Number(total_vol1.toFixed(4))
    lot.volume2 = Number(total_vol2.toFixed(4))

    return total_vol1
}



/**
 * Recherche un lot dans la BDD des lots par années et/ou par parcelle
 * @param {object} player - Le joueur
 * @param {object}  year - L'année du lot à rechercher
 * @returns {object|null} - L'objet lot trouvé ou null si non trouvé
 */

global.getLots = function(player, year) {

    const database = loadTreeData(player,`${global.pos_data.normalized_world_name}LotDatabase`)
    if (!database.lots) {return []}

    return Object.keys(database.lots).filter(lot_id => database.lots[lot_id].year === year)
}


global.getWoodLotStatus = function(player, value, year) {
    const database = loadTreeData(player, `${global.pos_data.normalized_world_name}LotDatabase`)
    if (!database.lots) return []

    return Object.keys(database.lots).filter(lot_id => {
        const lot = database.lots[lot_id]

        if (lot.statut !== value) return false
        if (!year) return true

        return lot.year === year
    })
}
