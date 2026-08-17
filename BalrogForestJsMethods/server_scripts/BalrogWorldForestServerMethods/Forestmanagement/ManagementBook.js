
function addInManagementBook(player, id, type, year, parcel, desc) {

    if (!global.forest_book.book[id]) {
        global.forest_book.book[id] = {}
    } else {
        messageChat(player, `Cette note existe déjà`)
        return
    }
    global.forest_book.book[id] = {
        year: year,
        type: type,
        parcel:parcel,
        desc: desc
    }
}


function deleteInManagementBook(player, id) {
    if (!global.forest_book.book[id]) {
        messageChat(player, ` Cette note n'existe pas`)
        return
    }
    delete global.forest_book.book[id]
}


function searchByYearInManagementBook(year) {

    let results = []

    for (let id in global.forest_book.book) {
        if (global.forest_book.book[id].year == year) {
            results.push(global.forest_book.book[id])
        }
    }
    return results
}

function searchByParcelInManagementBook(year) {

    let results = []

    for (let id in global.forest_book.book) {
        if (global.forest_book.book[id].parcel == parcel) {
            results.push(global.forest_book.book[id])
        }
    }
    return results
}