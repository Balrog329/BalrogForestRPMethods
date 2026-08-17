

// quand un lot est mis sur le marché via la commande, et la notion pending et le prix de retrait sont ajouté au lot 
// les buyer (BOT) wood_buyer font des propositions de vente, selon le marché
// la proposition survient entre 10 min à 1h après la mise en vente 
// si les prix proposer sont sous le prix min le lot est invendu
// une fois les propositions faites le meilleur remporte le lot.
// Le coefficient d'inflation joue sur le prix poposer pour le lot.
// une fois le lot acheter, les bois coupées et sortie de la forêt 
// on reverse 150% du prix du lot a l'acheteur depuis la caisse admin pour continuer a faire trouner l'éco du jeu



function buyer(player, lot_id) {

    let database = loadLotData(player, global.pos_data.normalized_world_name, `${global.pos_data.normalized_world_name}LotDatabase`)
    let lot_data = database.lots[lot_id]

    let comps = global.getCompanieByActivitie(player, "wood_buyer")

    let offers = []

    for (let comp of comps) {

        let full = global.getCompanieById(comp.id)

        if (full.balance < lot_data.redemption_price) continue


        let market_coef = computeMarketCoef(comps, full)
        let market_rate = global.economy.current_rate || 1.0
        let abst = 1 + Math.min(lot_data.volume1 / 20000, 0.5)

        let offer_price = Math.round(lot_data.redemption_price * market_coef * market_rate * abst)

        offers.push({
            buyer: full.id,
            amount: offer_price,
            comp: full
        })
    }


    if (offers.length === 0) {
        messageChat(player, `[EFM] Lot ${lot_id} invendu (aucune offre)`)
        lot_data.statut = "unsold"
        saveTreeData(player, `${global.pos_data.normalized_world_name}LotDatabase`, database)
        return
    }

    // tri
    offers.sort((a, b) => b.amount - a.amount)
    let best = offers[0]

    if (best.amount < lot_data.redemption_price) {
        messageChat(player, `[EFM] Lot ${lot_id} invendu (meilleure offre trop basse)`)
        lot_data.statut = "unsold"
        saveTreeData(player, `${global.pos_data.normalized_world_name}LotDatabase`, database)
        return
    }

    // vente
    finalizeLotSale(player, lot_id, best)
}


function setLotStatut(player, lot_id, statut, add_red_price) {

    let database = loadLotData(player, global.pos_data.normalized_world_name, `${global.pos_data.normalized_world_name}LotDatabase`)
    let lot_data = database.lots[lot_id]

    if (["for_sale", "sold", "pending", "cutting"].includes(lot_data.statut)) {
        messageChat(player, "Le lot est déjà vendu ou à vendre")
        return false
    }

    lot_data.statut = statut

    if (add_red_price === true) {
        lot_data.redemption_price = getRedemptionPrice(player, lot_id)
    }
    saveTreeData(player, `${global.pos_data.normalized_world_name}LotDatabase`, database)
    return true
}



function putLotOnMarket(player, lot_id) {

    if (!setLotStatut(player, lot_id, "pending", true)) {return}

    let delay = Math.floor(Math.random() * (360 - 60)) + 60  // 10 min → 1h

    console.info(`[Market] Lot ${lot_id} mis en vente, offre dans ${delay} sec`)
    messageChat(player, `[EFM] Lot ${lot_id} mis en vente`)

    // déclenche le buyer après le délai
    setTimeout(() => {
        buyer(player, lot_id)
    }, delay * 1000)
}


function finalizeLotSale(player, lot_id, best) {

    let database = loadLotData(player, global.pos_data.normalized_world_name, `${global.pos_data.normalized_world_name}LotDatabase`)
    let lot_data = database.lots[lot_id]

    lot_data.statut = "sold"
    lot_data.buyer = best.buyer
    lot_data.sold_price = best.amount

    saveTreeData(player, `${global.pos_data.normalized_world_name}LotDatabase`, database)

    messageChat(player, `[EFM] Lot ${lot_id} vendu à ${best.buyer} pour ${best.amount}`)

    transaction(best.buyer, lot_data.owner, best.amount)
    addInManagementBook(
        player,
        `fs_${lot_id}`,
        "lot_bp",
        global.pos_data.year,
        lot_data.parcel,
        `Lot n°${lot_id}, vendu à ${best.buyer} pour ${best.amount}`
    )

}

function computeMarketCoef(companies, comp) {

    let avg_balance = companies.reduce((sum, c) => sum + c.balance, 0) / companies.length

    let ratio = comp.balance / avg_balance

    // compression du ratio pour éviter les écarts énormes
    let market_coef = 1 + ((ratio - 1) * 0.3)

    return market_coef
}
