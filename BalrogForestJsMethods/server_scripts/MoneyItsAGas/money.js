
function transaction(from, to, amount) {

    // Débit
    global.entities[from].monetary_context.balance -= amount

    messageChat(Utils.server, '§4' + from + ' -' + amount + ' Z')

    // Crédit
    global.entities[to].monetary_context.balance += amount

    messageChat(Utils.server, '§2' + to + ' +' + amount + ' Z')
}
