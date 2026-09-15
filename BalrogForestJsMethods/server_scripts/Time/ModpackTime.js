
// Gère de manière dynamic le temps

// Se syncro selon l'année de la map si existant

// Objectif : Avoir un système de temps et de saison

// on regarde la dernière connection,

// on fait une fonction qui calcul la date interne du serveur



function initServerDate() {
    return {
        day : readServerDatTime().day || 1,
        month : readServerDatTime().month || 1,
        year : readServerDatTime().year || 1,
        last_save : readServerDatTime().last_save || String(getIrlDate())

    }
}


function saveServerDate() {
    global.server_date.last_save = getIrlDate().toString()
    return JsonIO.write(getJsonTimeFile(), global.server_date)
}

function getIrlDate(){
    return new Date()
}


function getJsonTimeFile() {
    return 'kubejs/server_scripts/Time/'+ global.getServerContext().normalized_serverName +'_server_time.json'
}

function newServDate() {
    global.server_date.day++
    calendar()
    if (global.server_date.day > 30) {
        global.server_date.day = 1
        global.server_date.month++

        // events mensuels
        for (let propriety in global.getServerContext().proprietiesInServer){
            taxeAndCost(propriety)
        }

        seasonChange()
    }

    if (global.server_date.month > 12) {
        global.server_date.month = 1
        global.server_date.year++
    }

    messageChat(Utils.server, "Nouveau jour : " + global.server_date.day + "." + global.server_date.month + "." + global.server_date.year)
}



ServerEvents.tick(event => {
    const time = event.server.getOverworld().getDayTime()
    if (time === Number(1005)) {
        newServDate()
    }
})



function majServerDateBylastConnection() {
    // calcul du temp écoulé depuis la dernière connection
    let secondes = differenceEnSecondes(global.server_date.last_save, getIrlDate().toString())
    let days = Math.round((secondes / 1200)* global.getServerContext().offline_time_coef)
    if (days <= 0) {return}
    for (let i = 0; i < days; i++){
        newServDate()
    }

    saveCachedData()
}

function differenceEnSecondes(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return Math.abs(d2.getTime() - d1.getTime()) / 1000;
}

