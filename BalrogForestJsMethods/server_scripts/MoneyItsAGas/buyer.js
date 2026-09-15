

// quand un lot est mis sur le marché via la commande, et la notion pending et le prix de retrait sont ajouté au lot 
// les buyer (BOT) wood_buyer font des propositions de vente, selon le marché
// la vente survient lors des vente groupées les 15/03 et 15/10 de chaque année
// si les prix proposer sont sous le prix min le lot est invendu
// une fois les propositions faites le meilleur remporte le lot.
// Le coefficient d'inflation joue sur le prix poposer pour le lot.
// une fois le lot acheter, les bois coupées et sortie de la forêt 
// on reverse 150% du prix du lot a l'acheteur depuis la caisse admin pour continuer a faire trouner l'éco du jeu



function buyer(lot_id) {

    let comps = global.getCompanieByActivitie("wood_buyer")

    let offers = []

    for (let comp of comps) {

        let full = global.getCompanieById(comp.id)

        if (full.balance < global.lot_database.lots[lot_id].redemption_price) continue


        let market_coef = computeMarketCoef(comps, full)
        let market_rate = global.economy.current_rate || 1.0
        let abst = 1 + Math.min(global.lot_database.lots[lot_id].volume1 / 20000, 0.5)

        let offer_price = Math.round(global.lot_database.lots[lot_id].redemption_price * market_coef * market_rate * abst)

        offers.push({
            buyer: full.id,
            amount: offer_price,
            comp: full
        })
    }


    if (offers.length === 0) {
        messageChat(Utils.server, `[EFM] Lot ${lot_id} invendu (aucune offre)`)
        global.lot_database.lots[lot_id].statut = "unsold"
        return
    }

    // tri
    offers.sort((a, b) => b.amount - a.amount)
    let best = offers[0]

    if (best.amount < global.lot_database.lots[lot_id].redemption_price) {
        messageChat(Utils.server, `[EFM] Lot ${lot_id} invendu (meilleure offre trop basse)`)
        global.lot_database.lots[lot_id].statut = "unsold"
        return
    }

    // vente
    finalizeLotSale(lot_id, best)
}


function setLotStatut(lot_id, statut, add_red_price) {

    if (["for_sale", "sold", "pending", "cutting"].includes(global.lot_database.lots[lot_id].statut)) {
        messageChat(Utils.server, "Le lot est déjà vendu ou à vendre")
        return false
    }

    global.lot_database.lots[lot_id].statut = statut

    if (add_red_price === true) {
        global.lot_database.lots[lot_id].redemption_price = getRedemptionPrice(lot_id)
    }

    return true
}



function putLotOnMarket(lot_id) {

    if (!setLotStatut(lot_id, "pending", true)) {return}
    let to_expert_sale = true // si cette commande est sur false le lot est vendu de suite, pas aux ventes des expert

    if (to_expert_sale === false) {
        buyer(lot_id)
    }

    console.info(`[Market] Lot ${lot_id} mis en vente`)
    messageChat(Utils.server, `[EFM] Lot ${lot_id} mis en vente`)

}


function finalizeLotSale(lot_id, best) {

    let lot_data = global.lot_database.lots[lot_id]

    global.lot_database.lots[lot_id].statut = "sold"
    global.lot_database.lots[lot_id].buyer = best.buyer
    global.lot_database.lots[lot_id].sold_price = best.amount

    messageChat(Utils.server, `[EFM] Lot ${lot_id} vendu à ${best.buyer} pour ${best.amount}`)

    transaction(best.buyer, lot_data.owner, best.amount)
    transaction(
        lot_data.owner,
        lot_data.referent_manager,
        (best.amount * 0.07) // Commission de l'expert 7% sur la vente
    )

    addInManagementBook(`fs_${lot_id}`, "lot_bp", lot_data.parcel, `Lot n°${lot_id}, vendu à ${best.buyer} pour ${best.amount}`)

}

function computeMarketCoef(companies, comp) {

    let avg_balance = companies.reduce((sum, c) => sum + c.balance, 0) / companies.length

    let ratio = comp.balance / avg_balance

    // compression du ratio pour éviter les écarts énormes
    let market_coef = 1 + ((ratio - 1) * 0.3)

    return market_coef
}

global.forestExpertLotSold= function() {
    for (let lot_id in global.lot_database.lots) {
        if (global.lot_database.lots[lot_id].statut === "pending") {
            buyer(lot_id)
        }
    }
}
