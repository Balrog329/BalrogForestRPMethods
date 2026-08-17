global.forestInfo = function(player){
    let pos_data = global.treePosMetadata(player, player.blockPosition())

    if (!pos_data) {
        messageChat(player, "§c❌ Aucune donnée forestière trouvée ici.")
        return
    }

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    messageChat(player,`§a🌲  §l${pos_data.name_id}`)
    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    messageChat(player, `§e📍 Parcelle : §6${pos_data.parcel}${pos_data.sub_parcel ? "." + pos_data.sub_parcel : ""}`)
    messageChat(player, `§e📐 Surface parcelle : §6${pos_data.parcel_surf}`)
    messageChat(player, `§e🌳 Surface forêt : §6${pos_data.Surface}`)

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    messageChat(player, `§e👤 Propriétaire : §b${pos_data.owner}`)
    messageChat(player, `§e🧑‍🌾 Gestionnaire : §b${pos_data.referent_manager}`)

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    messageChat(player, `§e📅 Date : §a${global.server_date.day}.${global.server_date.month}.${global.server_date.year}`)
    messageChat(player, `§e📘 Document de gestion : §a${pos_data.start_current_mdoc} §7→ §a${pos_data.end_current_mdoc}`)

    messageChat(player,"§2━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    return pos_data
}

