BlockEvents.rightClicked(event => {
    const player = event.player
    if (event.item.id == "minecraft:stick") {
        majServerDateBylastConnection(player)
        return
    }
})





BlockEvents.rightClicked(event => {

    let ctx = global.verifyAndGetTreeContext(event)
    if (!ctx) {return}

    // Mesure
    if (ctx.itemId == "immersiveengineering:hoe_steel" || ctx.itemId == 's_a_b:equality'){
        handleMeasureEvents(ctx, true)
    }
    // Mesure sans marque (si on place chevrons ou autre)
    if (ctx.itemId == 's_a_b:equality'){
        handleMeasureEvents(ctx)
    }

    // Marteau
    if (ctx.itemId == "immersiveengineering:hammer") {
        handleHammerEvent(ctx)
    }
    

    // Marquage avenir

    if (ctx.itemId == "immersiveengineering:dust_aluminum") {
        handleMarkingEvent(ctx, "futur")
    }
    // Marquage abandon
    if (ctx.itemId == "immersiveengineering:dust_copper") {
        handleMarkingEvent(ctx, "abandon")
    }
})


function handleMeasureEvents(ctx, mark) {
    let id = measureTree(ctx.player, ctx.tree_data, ctx.pos_data)
    if (!id) {return}

    if (!mark) {return id}
    else {
        let counted_mark_config = loadConfigData(ctx.player, "globalforestconfig").treeMark.counted
        findPhysicalTreeMark(ctx.player, global.trees_database.trees[id], counted_mark_config)
        return id
    }
}


function handleHammerEvent(ctx) {

    const player = ctx.player

    const mark_hammer_config = loadConfigData(player, "globalforestconfig").treeMark.hammering

    if (!global.current_wood_lot || global.current_wood_lot === "None") {
        messageChat(player, "Aucun lot n'a été définit, veuillez en créer un ou en sélectionner un existant.")
        return
    }

    const id = measureTree(player, ctx.tree_data, ctx.pos_data)
    console.info(id)
    if (!id || !global.trees_database.trees[id]) {return null}


    if (ctx.sneaking) {
        reserveHammeringTree(player, ctx.tree_data, ctx.pos_data, global.current_wood_lot)
    } else {
        hammaringTree(player, id, global.trees_database.trees[id], ctx.pos_data, mark_hammer_config, global.current_wood_lot)
    }
    return id
}
function handleMarkingEvent(ctx, mark_type) {

    let mark_config = null
    if (mark_type == "futur") {
        mark_config = loadConfigData(ctx.player, "globalforestconfig").treeMark.futur
    }
    if (mark_type == "abandon") {
        mark_config = loadConfigData(ctx.player, "globalforestconfig").treeMark.abandon
    }
    if (!mark_config) return null

    let id = measureTree(ctx.player, ctx.tree_data, ctx.pos_data)

    if (!id || !global.trees_database.trees[id]) {return null}

    if (ctx.sneaking) {
        reserveMarkedTree(ctx.player, id, global.trees_database.trees[id])
    } else {
        markTree(ctx.player, id, global.trees_database.trees[id], mark_config)
    }

    return id
}
