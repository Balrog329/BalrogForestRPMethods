
function transaction(from, to, amount) {
    let data = loadLegalEntity()

    const company_from = data[from]
    const company_to = data[to]

    // Débit
    company_from.monetary_context.balance -= amount

    // Crédit
    company_to.monetary_context.balance += amount

    JsonIO.write("kubejs/data/MoneyData/legals_entities.json", data)
}



function loadLegalEntity(){
    return JsonIO.read("kubejs/data/MoneyData/legals_entities.json")
}


global.getAdminCompanies = function(player) {
    const uuid = player.username
    const data = loadLegalEntity()
    const companies = []

    Object.keys(data).forEach(key => {
        const company = data[key]
        if (company.administrator === uuid) {
            companies.push({
                id: key,
                name: company.first_name,
                abreviation: company.abreviation,
                balance: company.monetary_context.balance
            })
        }
    })

    return companies
}

global.getCompanieByActivitie = function(player, activ) {
    const data = loadLegalEntity()

    const companies = []

        Object.keys(data).forEach(key => {
        const company = data[key]
        if (company.activ === activ) {
            companies.push({
                id: key,
                name: company.first_name,
                abreviation: company.abreviation,
                balance: company.monetary_context.balance
            })
        }
    })

    return companies
}

global.getCompanieById = function(id){
    const data = loadLegalEntity()[id]
    return {
        id: id,
        name: data.first_name,
        abreviation: data.abreviation,
        balance: data.monetary_context.balance,
        monetary_context: data.monetary_context,
        activ: data.activ,
        holding: data.holding,
        properties: data.properties
    }
}
