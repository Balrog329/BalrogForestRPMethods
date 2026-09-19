global.resolveForestNameByPos = function(x, z) {
    // let name = getPolygonNames(x, z)[0]
    // if (!name) {return}
    // return name.forest
    return global.resolveProperty(x,z).normalized_world_name
}

global.resolveParcelNameByPos = function (x, z) {
    // let name = String(getPolygonNames(x, z)[0].name).split(".")[0]
    // if (!name) {return}
    // return name
    return global.getPolygonData(x, z, "parcelle_forestiere").name1
}

global.resolveSubParcelByPos = function (x, z) {
    // let name = String(getPolygonNames(x, z)[0].name).split(".")[1]
    // if (!name) {return}
    // return name
    let name = global.getPolygonData(x, z, "sous_parcelle_forestiere")
    if(!name) {return}
    return name.name1
}

global.resolveParcelSurfaceByPos = function (x, z) {
    // let name = String(getPolygonNames(x, z)[0].surface)
    // if (!name) {return}
    // return name
    let name =  global.getPolygonData(x,z, "sous_parcelle_forestiere")
    if(!name) {
        return global.getPolygonData(x,z, "parcelle_forestiere").name2
    }
    return name.name2
}


/**
 * 1. Résolution géométrique : Récupère le polygone MapFrontiers à une position (x, z)
 * @param {number} x - Coordonnée X
 * @param {number} z - Coordonnée Z
 * @param {string} collectionName - Nom du groupe/collection MapFrontiers
 * @returns {object|null} L'objet parcelle/frontière MapFrontiers brut
 */
global.getPolygonData = function (x, z, collectionName) {
    if (!collectionName) return null

    let parcels = getDatPolygonNames(x, z)
    if (!parcels) return null

    let targetCollectionId = resolveCollectionIdByName(collectionName)
    if (!targetCollectionId) {
        if (typeof messageChat !== 'undefined' && Utils.server) {
            messageChat(Utils.server, "Collection '" + collectionName + "' introuvable dans MapFrontiers !")
        } else {
            console.warn("Collection '" + collectionName + "' introuvable dans MapFrontiers !")
        }
        return null
    }

    // Recherche du polygone correspondant à la collection ciblée
    for (let parcel of parcels) {
        if (parcel.collectionId === targetCollectionId) {
            return parcel
        }
    }

    return null
}


/**
 * 2. Résolution métier : Récupère la propriété foncière KubeJS à une position (x, z)
 * @param {number} x - Coordonnée X
 * @param {number} z - Coordonnée Z
 * @returns {object|null} La propriété issue de global.proprieties
 */
global.resolveProperty = function (x, z) {
    // On réutilise la fonction géométrique pure sur la collection "cadastre"
    let cadastreParcel = global.getPolygonData(x, z, "cadastre")
    if (!cadastreParcel) return null

    let parcelName = cadastreParcel.name1 || cadastreParcel.name2
    return global.findPropretyWithIdu(parcelName)
}

/**
 * Résout l'UUID d'une collection MapFrontiers à partir de son nom
 */
function resolveCollectionIdByName(collectionName) {
    if (!global.frontiers || !global.frontiers.collections) return null

    for (let collection of global.frontiers.collections) {
        if (collection.name && collection.name.toLowerCase() === collectionName.toLowerCase()) {
            return collection.id
        }
    }
    return null
}

/**
 * Cherche une propriété dans global.proprieties à partir d'un IDU cadastral
 */
global.findPropretyWithIdu = function (parcel_name) {
    if (!parcel_name) return null

    let targetParcel = String(parcel_name).trim().toUpperCase()

    for (let propId in global.proprieties) {
        let propertyData = global.proprieties[propId]

        if (propertyData.parca) {
            for (let i = 0; i < propertyData.parca.size(); i++) {
                let currentParcel = String(propertyData.parca.get(i).getAsString()).trim().toUpperCase()

                if (currentParcel === targetParcel) {
                    return propertyData
                }
            }
        }
    }
    return null
}