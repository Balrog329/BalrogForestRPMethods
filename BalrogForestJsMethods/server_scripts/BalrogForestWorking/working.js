// Table des travaux et leurs prix de base à l'hectare

global.forestwork = {
        "broyage_plein_ou_bande": 1800,
        "rangement_remanents_andains": 1800,
        "nettoyage_plein_broyage_accrus": 1800,
        "sous_solage": 550,
        "degagement_ligne": 800,
        "entretien_interlignes_1_sur_2": 350,
        "entretien_interlignes_plein": 950,

        "potets_minipelle": 3700,
        "plantation": 4500,
        "repulsif_trico": 800,
        "gaine_filet_piquets": 4700,
        "cloture_grillagee": 15,

}
// flat le tableau pour les commandes
global.getForestWork = function() {
    let data = []
    for (let work in global.forestwork) {
        data.push(work)
    }
    return data
}




function buildForestQuote(player, work_type, parcel, surface) {

    let json_name = `${global.pos_data.normalized_world_name}_forest_quotes`

    let database = loadTreeData(player, json_name)

    let quotes_id = `${global.pos_data.id}_${global.pos_data.year}_${work_type}_P${parcel}`
    if (!database.quotes) {
        database.quotes = {}
    }

    database.quotes[quotes_id] = {
        forest_name: global.pos_data.normalized_world_name,
        id: quotes_id,

        forest_id: global.pos_data.id,
        work_type: work_type,
        parcel: parcel,
        surface: surface,
        price: setTotalPrice(work_type, surface),

        year: global.pos_data.year,
        owner: global.pos_data.owner,
        referent_manager: global.pos_data.referent_manager,
        status: "pending"

    }

    saveTreeData(player, json_name, database)
    messageChat(player, `Le devis pour ${work_type} est proposé pour la somme de ${database.quotes[quotes_id].price}`)
    return database.quotes[quotes_id]

}

function setTotalPrice(work_name, surf) {

    let price = 0

    if (work_name === "cloture_grillagee") {
        price = getPerimeterFromHa(surf)
            * global.forestwork[work_name]
            * global.economy.current_rate
            * 0.2 * 0.25
    } else {
        price = global.forestwork[work_name]
            * surf
            * global.economy.current_rate
            * 1.2 * 1.25
    }

    return price
}



function getPerimeterFromHa(surfaceHa) {
    const surfaceM2 = surfaceHa * 10000
    const side = Math.sqrt(surfaceM2)
    return 4 * side // périmètre en mètres
}

global.getQuotes = function(player, year) {

    const database = loadTreeData(player,`${global.pos_data.normalized_world_name}_forest_quotes`)
    if (!database.quotes) {return []}

    return Object.keys(database.quotes).filter(quotes_id => database.quotes[quotes_id].year === year)
}


function acceptQuotes(player, quote_id) {

    let json_name = `${global.pos_data.normalized_world_name}_forest_quotes`

    let database = loadTreeData(player, json_name)

    let quote = database.quotes[quote_id]
    if (quote.status == "accepted"){
        messageChat(player, "Ce devis à deja été accepter")
        return
    }
    if (quote.year + 2 < global.pos_data.year) {
        messageChat(player, "Ce devis n'est plus valide")
        return
    }

    quote.status = "accepted"

    saveTreeData(player, json_name, database)

    messageChat(player, `✔ Le devis ${quote.id} a été accepté pour ${quote.price} Z.`)

    transaction(global.pos_data.owner, "BANK", quote.price)
    addInManagementBook(
        player,
        quote_id,
        "travaux",
        global.pos_data.year,
        quote.parcel,
        `Parcelle ${quote.parcel}, Les travaux ${quote.work_type} ont été accepté pour ${quote.price} Z.`
    )
}
