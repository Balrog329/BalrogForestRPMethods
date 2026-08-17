
function forestExpertise(player, parcel) {
    let pos_data = global.treePosMetadata(player, player)
    let trees = getTreesInParcel(player, parcel, pos_data)

    if (trees.length === 0) {
        messageChat(player, `Aucun arbre trouvé dans la parcelle ${parcel}.`)
        return null
    }

    let bySpecies = groupTreesBySpecies(player, trees)
    let report = computeSpeciesStats(bySpecies)
    let reportObj = buildForestExpertiseReport(player, parcel, report, pos_data)

    saveForestExpertiseReport(player, parcel, reportObj, pos_data)
    sendForestExpertiseChatReport(player, reportObj)

    return reportObj
}



function getTreesInParcel(player, parcel, pos_data) {

    let forest = pos_data.normalized_world_name
    let tree_json_name = `${forest}Treesdatabase`
    let trees_db = loadTreeData(player, tree_json_name)

    if (!trees_db || !trees_db.trees) return []

    return Object.values(trees_db.trees).filter(tree => {
        return tree.parcel === parcel && tree.harvested !== true
    })
}



function groupTreesBySpecies(player, trees) {
    let bySpecies = {}

    for (let tree of trees) {
        let sp = tree.species

        if (!bySpecies[sp]) {
            bySpecies[sp] = {
                species: sp,
                count: 0,
                total_volume: 0,
                total_price: 0,
                radius: [],
            }
        }

        bySpecies[sp].count++
        bySpecies[sp].total_volume += tree.vol1 || 0
        bySpecies[sp].radius.push(tree.radius || 0)
        bySpecies[sp].total_price += getTreeLogDynamicPrice(player, sp, tree.quality || 1)
    }

    return bySpecies
}

function computeSpeciesStats(bySpecies) {
    let report = []

    for (let sp in bySpecies) {
        let data = bySpecies[sp]

        let avg_radius = data.radius.reduce((a,b)=>a+b,0) / data.radius.length

        report.push({
            species: sp,
            stems: data.count,
            total_volume: Math.round(data.total_volume * 100) / 100,
            avg_radius: Math.round(avg_radius * 10) / 10,
            total_price: Math.round(data.total_price),
        })
    }

    return report
}

function buildForestExpertiseReport(player, parcel, report, pos_data) {
    return {
        forest: pos_data.name_id,
        normalized_forest: pos_data.normalized_world_name,
        parcel: parcel,

        // Données forestInfo
        parcel_surface: pos_data.parcel_surf,
        forest_surface: pos_data.forest_surf,
        owner: pos_data.owner,
        manager: pos_data.referent_manager,
        year: pos_data.year,
        management_doc: {
            start: pos_data.start_current_mdoc,
            end: pos_data.end_current_mdoc
        },
        // Expertise
        expertise: report
    }
}

function saveForestExpertiseReport(player, parcel, reportObj, pos_data) {
    let fileName = `expertise_${pos_data.normalized_world_name}_P${parcel}_${pos_data.year}`
    saveTreeData(player, fileName, reportObj)
}

function sendForestExpertiseChatReport(player, reportObj) {

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    messageChat(player,`§a📘 Expertise forestière — §l${reportObj.forest}`)
    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    messageChat(player, `§e📍 Parcelle : §6${reportObj.parcel}`)
    messageChat(player, `§e📐 Surface parcelle : §6${reportObj.parcel_surface}`)
    messageChat(player, `§e🌳 Surface forêt : §6${reportObj.forest_surface}`)

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    messageChat(player, `§e👤 Propriétaire : §b${reportObj.owner}`)
    messageChat(player, `§e🧑‍🌾 Gestionnaire : §b${reportObj.manager}`)

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    messageChat(player, `§e📅 Année de gestion : §a${reportObj.year}`)
    messageChat(player, `§e📘 Document de gestion : §a${reportObj.management_doc.start} §7→ §a${reportObj.management_doc.end}`)

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    // Expertise par essence
    for (let item of reportObj.expertise) {
        messageChat(player, `§e🌲 Essence : §a${item.species}`)
        messageChat(player, `§e🌱 Tiges : §6${item.stems}`)
        messageChat(player, `§e📦 Volume total : §6${item.total_volume} m³`)
        messageChat(player, `§e📏 Diamètre moyen : §6${item.avg_radius} cm`)
        messageChat(player, `§e💰 Valeur totale : §6${item.total_price} Z`)
        messageChat(player, `§7--------------------------------`)
    }

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}
