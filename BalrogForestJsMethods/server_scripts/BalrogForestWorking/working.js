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




function buildForestQuote(player, property, work_type, parcel, surface) {

    let pos_data = global.forest_management[global.resolveForestNameByPos(player.x, player.z)]

    let quotes_id = `${property}_${global.server_date.year}_${work_type}_P${parcel}`
    if (!global.forest_quotes.quotes) {
        global.forest_quotes.quotes = {}
    }

    global.forest_quotes.quotes[quotes_id] = {
        forest_name: pos_data.normalized_world_name,
        id: quotes_id,

        forest_id: property,
        work_type: work_type,
        parcel: parcel,
        surface: surface,
        price: setTotalPrice(work_type, surface),

        year: global.server_date.year,
        owner: pos_data.owner,
        referent_manager: pos_data.referent_manager,
        status: "pending"

    }

    messageChat(Utils.server, `Le devis pour ${work_type} est proposé pour la somme de ${global.forest_quotes.quotes[quotes_id].price}`)
    return global.forest_quotes.quotes[quotes_id]

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

    if (!global.forest_quotes.quotes) {return []}

    return Object.keys(global.forest_quotes.quotes).filter(quotes_id => global.forest_quotes.quotes[quotes_id].year === year)
}


function acceptQuotes(player, quote_id) {


    let quote = global.forest_quotes.quotes[quote_id]
    if (quote.status === "accepted"){
        messageChat(Utils.server, "Ce devis à deja été accepté")
        return
    }
    if (quote.year + 2 < global.server_date.year) {
        messageChat(Utils.server, "Ce devis n'est plus valide")
        return
    }

    quote.status = "accepted"

    messageChat(Utils.server, `✔ Le devis ${quote.id} a été accepté pour ${quote.price} Z.`)

    transaction(quote.owner, "BANK", quote.price)
    addInManagementBook(
        quote_id,
        "travaux",
        quote.forest_id,
        quote.parcel,
        `Parcelle ${quote.parcel}, Les travaux ${quote.work_type} ont été accepté pour ${quote.price} Z.`
    )
}
