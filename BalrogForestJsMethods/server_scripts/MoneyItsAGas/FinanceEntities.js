
function newEntities(name, activ, administrator) {

    global.entities[name] = {
        first_name: name,
        first_name_id: parseMcWorld(name),
        administrator: administrator,
        activ: activ,
        properties: {},
        monetary_context: {
            balance: 100.0,
            loans: "NULL"
        }
    }

    messageChat(Utils.server, '§b-> Nouvelle entité créée : ' + name)
    saveCachedData()

    return name
}


global.getAdminCompanies = function(player) {
    const uuid = player.username
    const data = global.entities
    const companies = []

    Object.keys(data).forEach(key => {
        const company = data[key]
        if (company.administrator === uuid && company.properties) {
            companies.push({
                id: key,
                name: company.first_name,
                balance: company.monetary_context.balance
            })
        }
    })

    return companies
}

global.getCompanieByActivitie = function (activ) {
    const data = global.entities

    const companies = []

    Object.keys(data).forEach(key => {
        const company = data[key]
        if (company.activ === activ) {
            companies.push({
                id: key,
                name: company.first_name,
                balance: company.monetary_context.balance
            })
        }
    })

    return companies
}

global.getCompanieById = function(id){
    const data = global.entities[id]
    return {
        id: id,
        name: data.first_name,
        balance: data.monetary_context.balance,
        monetary_context: data.monetary_context,
        activ: data.activ,
        holding: data.holding,
        properties: data.properties
    }
}

