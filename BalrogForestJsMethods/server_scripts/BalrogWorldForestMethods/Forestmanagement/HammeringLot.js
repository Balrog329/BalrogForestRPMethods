function getLotId(player, pos_data) {
    let year = getScoreboardValue(player, "year");
    let lot_num = getScoreboardValue(player, "lot_id");

    return `${pos_data.id}_${pos_data.parcel}_${year}_${lot_num}`;
}

function getLot(player, pos_data) {

    let year = getScoreboardValue(player, "year");
    let lot_num = getScoreboardValue(player, "lot_id");

    let json_name = `${pos_data.normalized_world_name}_lot_database`;

    let database = loadTreeData(player, json_name);

    if (!database.lots) {
        database.lots = {};
    }

    let lotId = getLotId(player, pos_data);

    if (!database.lots[lotId]) {

        database.lots[lotId] = {
            id: lotId,

            forest_id: pos_data.id,
            parcel: pos_data.parcel,

            year: year,
            lot_num: lot_num,

            owner: pos_data.owner,

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