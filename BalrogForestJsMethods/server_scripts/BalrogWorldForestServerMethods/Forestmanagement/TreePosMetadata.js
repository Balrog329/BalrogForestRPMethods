
// renvoie les métadonnées temporaire de la forêt pour une position définie

global.treePosMetadata = function(player, tree_data) {

    const parcelles_raw = getPolygonNames(player, tree_data.x, tree_data.z)

    if (!parcelles_raw || parcelles_raw.length === 0) {
        player.tell("Tu es dans la nature sauvage.");
        return null;
    }

    const forestConfig = loadConfigData(player, "forest_management").forestManagement;
    const isNumber = (v) => /^\d+(\.0)?$/.test(String(v));

    let forest_meta = null
    let parcel = null
    let parcelSurf = null
    let forestSurf = null
    
    let p = null
    let meta = null
    let keys = null
    let sub_parcel
    let num
    let after

    for (let i = 0; i < parcelles_raw.length; i++) {
        p = parcelles_raw[i];

        // PARCELLE
        num = parseInt(String(p.name))
        after = String(p.name).replace(/^\d+\.?/, "")

        if (!isNaN(num)) {
            parcel = num
            parcelSurf = p.surface
            sub_parcel = after
        }

        // FORÊT
        if (p.forest) {
            keys = Object.keys(forestConfig)

            for (let j = 0; j < keys.length; j++) {
                meta = forestConfig[keys[j]]

                if (meta.name_id === String(p.forest)) {
                    forest_meta = meta
                    forestSurf = p.surface
                    break
                }
            }
        }
    }



    if (!forest_meta) {
        messageChat(player, "Forêt introuvable");
        return null;
    }

    return {
            id: forest_meta.id,
            name_id: forest_meta.name_id,
            world_name: forest_meta.world_name,
            normalized_world_name: forest_meta.normalized_world_name,
            Surface: forest_meta.Surface,
            owner: forest_meta.owner,
            referent_manager: forest_meta.referent_manager,
            year: forest_meta.current_year,
            start_current_mdoc: forest_meta.start_current_mdoc,
            end_current_mdoc: forest_meta.end_current_mdoc,
            offline_time_coef: forest_meta.offline_time_coef,

            parcel: parcel,
            sub_parcel: sub_parcel,
            parcel_surf: parcelSurf
        }
}