
// renvoie les métadonnées temporaire de la forêt pour une position définie

function treePosMetadata(player, tree_data) {
    const parcelles_raw = getPolygonNames(player, tree_data.x, tree_data.z);

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

    for (let i = 0; i < parcelles_raw.length; i++) {
        p = parcelles_raw[i]

        if (isNumber(p.name)) {
            parcel = parseInt(p.name);
            parcelSurf = p.surface;
            continue;
        }

        keys = Object.keys(forestConfig);

        for (let j = 0; j < keys.length; j++) {
            meta = forestConfig[keys[j]];

            if (meta.name_id === p.name) {
                forest_meta = meta;
                forestSurf = p.surface;
                break;
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

            forest_surf: forestSurf,
            parcel: parcel,
            parcel_surf: parcelSurf
        }

}