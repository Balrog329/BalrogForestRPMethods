
// taxe relative à la surface
function taxeAndCost(propriety) {
    const pos_data = global.forest_management[propriety]
    messageChat(Utils.server, "§2Coût mensuel pour " + propriety)
    for (let value in global.cost_and_taxes) {
        transaction(pos_data.owner, 'BANK', global.cost_and_taxes[value] * pos_data.Surface)
    }
}

