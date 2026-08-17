let last_day = new Date().getDate()

if (!global.economy) {
    global.economy = {
        current_rate: 1.0
    }

}

console.info(`Economy, current rate = ${global.economy.current_rate}`)

ServerEvents.tick(event => {

    const current_day = new Date().getDate()

    if (current_day === last_day) return

    last_day = current_day

    const max_delta = 0.05
    const delta = (Math.random() * 2 - 1) * max_delta

    global.economy.current_rate += delta

    if (global.economy.current_rate < 0.5) global.economy.current_rate = 0.5
    if (global.economy.current_rate > 2.0) global.economy.current_rate = 2.0

    console.info(`Nouveau taux : ${global.economy.current_rate}`)
})


function getTreeLogDynamicPrice(player, species, quality) {

    const speciesdata = loadConfigData(player, "speciesdata")[species]

    let log_base_price = speciesdata.log_base_price

    if (log_base_price === undefined) {
        log_base_price = speciesdata.energy_base_price
    }

    let price = log_base_price * global.economy.current_rate

    if (quality === 2) {
        price = price / 2
    }

    return Math.round(price)
}



function getRedemptionPrice(player, lot_id) {
    
    const lot = loadLotData(player, global.pos_data.normalized_world_name, `${global.pos_data.normalized_world_name}LotDatabase`).lots[lot_id]
    const trees_database = global.trees_database.trees
    
    let price = 0
    for (let tree in lot.trees) {

        const treeData = trees_database[tree]

        if (!treeData) {
            console.info(`Arbre absent de la base : ${tree}`)
            continue
        }
        price += getTreeLogDynamicPrice(player, treeData.species, treeData.quality) * treeData.vol1
        console.info(price)
    }

    return price
}


