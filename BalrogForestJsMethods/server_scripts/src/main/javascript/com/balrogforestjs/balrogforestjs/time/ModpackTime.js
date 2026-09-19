
// Gère de manière dynamic le temps

// Se syncro selon l'année de la map si existant

// Objectif : Avoir un système de temps et de saison

// on regarde la dernière connection,

// on fait une fonction qui calcul la date interne du serveur



function initServerDate() {
    let savedData = readServerDatTime();
    return {
        day: savedData.day ?? 1,
        month: savedData.month ?? 1,
        year: savedData.year ?? 1,
        // On stocke un Timestamp numérique (ex: 1789498533000)
        last_save: savedData.last_save ?? getIrlDate().getTime()
    };
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
    // Calcul direct de la différence en secondes avec les timestamps
    let now = getIrlDate().getTime();
    let lastSave = Number(global.server_date.last_save);

    // Calcul de la différence en secondes
    let secondes = Math.abs(now - lastSave) / 1000;

    let days = Math.round((secondes / 1200) * global.getServerContext().offline_time_coef);

    if (days > 0) {
        for (let i = 0; i < days; i++) {
            newServDate();
        }
    }

    // Mettre à jour la date de sauvegarde avec l'instant présent avant d'enregistrer
    global.server_date.last_save = now;
    saveCachedData();
}


