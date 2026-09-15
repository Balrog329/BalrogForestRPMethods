
function getNBTdbFile(nbt_table_name, is_old) {
    if (is_old === true) {
        return `${global.getServerContext().balrogdataDir}/${nbt_table_name}.dat_old`
    }
    return `${global.getServerContext().balrogdataDir}/${nbt_table_name}.dat`
}

function loadNBTTreeData() {
    const file = getNBTdbFile('trees', false)

    return NBTIO.read(file) || {
        server: global.getServerContext().serverName,
        trees: {}
    }
}

function loadLotDat() {
    const file = getNBTdbFile('woodlot', false)
    return NBTIO.read(file) || {
        server: global.getServerContext().serverName,
        lots: {}
    }
}

function loadQuotes() {
    const file = getNBTdbFile('quotes', false)
    return NBTIO.read(file) || {}
}

function saveDat(nbt_table_name, data, is_old) {
    console.info(`[SAVE] ${nbt_table_name}`)

    const file = String(getNBTdbFile(nbt_table_name, is_old))

    NBTIO.write(file, data)
}


function loadEntitiesDat() {
    return NBTIO.read(String(getNBTdbFile('entities', false))) || {
        "BANK": {
            first_name: "bank",
            first_name_id: "bank",
            administrator: "bank",
            activ: "bank",
            properties: {
                "public":"public"
            },
            monetary_context: {
                balance: 100000000.0,
                loans: "NULL"
            }
        }
    }
}

function saveEntitiesDat(table_name, data, is_old) {

    return NBTIO.write(String(getNBTdbFile(table_name, is_old)), data)
}


function loadMarkedTreesDb() {

    const file = getNBTdbFile('marked_trees', false)

    return NBTIO.read(file) || {
        server: global.getServerContext().normalized_serverName,
        marked: {
            trees: {}
        }
    }
}


function loadProprietiesdat() {
    const file = getNBTdbFile('proprieties', false)

    return NBTIO.read(file) || {
        "public": {
            name_id: "public",
            id: 0,
            world_name: global.getServerContext().serverName,
            world_dir: global.getServerContext().serverDir,
            normalized_world_name: "public",
            Surface: 0,
            owner: "BANK",
            referent_manager: "BANK",
            current_year: 0,
            start_current_mdoc: 0,
            end_current_mdoc: 0
        }
    }
}

function readServerDatTime(){
    return NBTIO.read(getNBTdbFile('servertime', false)) || {}
}



