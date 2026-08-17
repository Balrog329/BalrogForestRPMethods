
// Gère de manière dynamic le temps

// Se syncro selon l'année de la map si existant

// Objectif : Avoir un système de temps et de saison

// on regarde la dernière connection,

// on fait une fonction qui calcul la date interne du serveur



function initServerDate(player) {
    return {
        server_name : readJsonTime(player).server_name || getMcWorld(player),
        day : readJsonTime(player).day || 1,
        month : readJsonTime(player).month || 1,
        year : readJsonTime(player).year || global.treePosMetadata(player, player).year || 1,
        last_save : readJsonTime(player).last_save || String(getIrlDate())

    }
}


function saveServerDate(player) {
    global.server_date.last_save = getIrlDate().toString()
    return JsonIO.write(getJsonTimeFile(player), global.server_date)
}

function getIrlDate(){
    return new Date()
}

function readJsonTime(player){
    return JsonIO.read(getJsonTimeFile(player)) || {}
}

function getJsonTimeFile(player) {
    return `kubejs/server_scripts/Time/${getMcWorld(player)}_server_time.json`
}

function newServDate(player) {
    global.server_date.day++

    if (global.server_date.day > 30) {
        global.server_date.day = 1
        global.server_date.month++
    }

    if (global.server_date.month > 12) {
        global.server_date.month = 1
        global.server_date.year++
    }

    messageChat(player, `Nouveau jour : ${global.server_date}`)
}



ServerEvents.tick(event => {
    const time = event.server.getOverworld().getDayTime()
    if (time === Number(1005)) {
        newServDate()
    }
})



function majServerDateBylastConnection(player) {
    // calcul du temp écoulé depuis la dernière connection
    let secondes = differenceEnSecondes(global.server_date.last_save, getIrlDate().toString())
    let days = Math.round((secondes / 1200)* global.treePosMetadata(player,player).offline_time_coef)
    if (days <= 0) {return}
    for (let i = 0; i < days; i++){
        newServDate(player)
    }

    saveCachedData(player)
}

function differenceEnSecondes(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return Math.abs(d2.getTime() - d1.getTime()) / 1000;
}

