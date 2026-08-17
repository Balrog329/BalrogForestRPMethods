



/**
 * Construit les interventions agrégées.
 *
 * Une entrée correspond à :
 *
 * ANNEE + PARFOR + CODE_INTERV + SPECIES
 *
 * Les différentes parcelles concernées sont regroupées
 * dans le tableau "parcelles".
 */
function buildInterventions(geojson) {

    const result = {}

    for (let feature of geojson.features) {

        let p = feature.properties

        let annee = Number(p.ANNEE)
        let parfor = Number(p.PARFOR)

        let code = p.CODE_INTERV
        let species = p.SPECIES || null

        /*
         * Exemple :
         *
         * 2026_43_AME_dynamictrees:oak
         */
        let id = [annee, parfor, code, species || "none"].join("_")

        /*
         * Première apparition de cette combinaison
         */
        if (!result[id]) {

            result[id] = {
                id: id,

                annee: annee,
                parfor: parfor,

                code: code,
                type: p.TYPE_INTERV,
                categorie: p.CATEGORIE,

                species: species,

                parcelles: [],

                count: 0
            }
        }

        let data = result[id]

        /*
         * Nombre de lignes correspondant
         * à cette intervention.
         */
        data.count++

        /*
         * On garde les parcelles uniques.
         */
        if (
            p.name1 &&
            data.parcelles.indexOf(p.name1) === -1
        ) {
            data.parcelles.push(p.name1)
        }
    }

    return result
}


/**
 * Retourne toutes les interventions d'une année.
 */
function getInterventions(year) {

    const result = {}

    year = Number(year)

    if (!global.pdc_table) {
        return result
    }

    for (const id in global.pdc_table) {

        const data = global.pdc_table[id]

        if (data.annee === year) {
            result[id] = data
        }
    }

    return result
}


/**
 * Affichage
 */
function printManagementBookInChat(player, year) {

    const pos_data = global.forestInfo(player)

    if (!global.pdc_table) {
        messageChat(player, "§cPDC est manquant ou n'a pas été mis en cache. Veuillez le créer ou quitter et rejoindre le serveur en étant dans la forêt.")
        return
    }

    printInterventionsSummary(player, year)
}


/**
 * Affiche toutes les interventions d'une année.
 */
function printInterventionsSummary(player, year) {

    const interventions = getInterventions(year)

    const ids = Object.keys(interventions)

    if (ids.length === 0) {
        messageChat(player, "§cAucune intervention pour " + year)
        return
    }

    messageChat(player, "§6===== §eInterventions de §a" + year + " §6=====")

    for (const id of ids) {

        let data = interventions[id]

        messageChat(player, "§d" + data.categorie)
        messageChat(player, "§b   → " + data.type)
        messageChat(player, "§7      Code : §f" + data.code)
        messageChat(player, "§7      PARFOR : §f" + data.parfor)
        messageChat(player, "§7      Essence : §f" + (data.species || "Aucune"))
        messageChat(player, "§7      Parcelles : §f" + data.parcelles.join(", "))
        messageChat(player, "§7      Nombre d'interventions : §a" + data.count)
        messageChat(player, "")
    }
}