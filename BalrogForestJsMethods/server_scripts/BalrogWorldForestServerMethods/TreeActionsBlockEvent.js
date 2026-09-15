BlockEvents.rightClicked(event => {
    if (event.item.id == "minecraft:stick") {

        let test = test22(event.player)

    }
})



BlockEvents.leftClicked(event => {

    let ctx = global.verifyAndGetTreeContext(event)
    if (!ctx) { return }

    if (ctx.itemId == "kubejs:blue_painter") {

        if (global.blue_mark_type == "futur") {
            global.blue_mark_type = "right_arrow"
        } else if (global.blue_mark_type == "right_arrow") {
            global.blue_mark_type = "left_arrow"
        } else {
            global.blue_mark_type = "futur"
        }

        messageChat(Utils.server, `§bType de marquage : ${global.blue_mark_type}`)
        event.cancel()
    }
})



BlockEvents.rightClicked(event => {

    let ctx = global.verifyAndGetTreeContext(event)
    if (!ctx) {return}

    // Mesure
    if (ctx.itemId == "kubejs:forest_caliper" || ctx.itemId == 's_a_b:equality'){
        handleMeasureEvents(ctx, true)
    }
    // Mesure sans marque (si on place chevrons ou autre)
    if (ctx.itemId == 's_a_b:equality'){
        handleMeasureEvents(ctx)
    }

    // Marteau
    if (ctx.itemId == "kubejs:forest_hammer") {
        handleHammerEvent(ctx)
    }
    

    // Marquages bleues

    if (ctx.itemId == "kubejs:blue_painter") {
        handleMarkingEvent(ctx, global.blue_mark_type)
    }
    // Marquage abandon
    if (ctx.itemId == "kubejs:red_painter") {
        handleMarkingEvent(ctx, "abandon")
    }
})


function handleMeasureEvents(ctx, mark) {
    let id = measureTree(ctx.tree_data)
    if (!id) {return}
    treeAnnouncement(ctx.player.username, "pointeur", id)
    if (!mark) {return id}
    else {
        console.info(global.trees_database.getCompound("trees").getCompound(id))
        findPhysicalTreeMark(global.trees_database.trees[id], loadConfigData("globalforestconfig").treeMark.counted)
        return id
    }

}


function handleHammerEvent(ctx) {

    const mark_hammer_config = loadConfigData("globalforestconfig").treeMark.hammering

    if (!global.current_wood_lot || global.current_wood_lot === "None") {
        messageChat(Utils.server, "Aucun lot n'a été définit, veuillez en créer un ou en sélectionner un existant.")
        return
    }


    const tree_id = measureTree(ctx.tree_data)

    if (!tree_id || !global.trees_database.trees[tree_id]) {return null}


    if (ctx.sneaking) {
        reserveHammeringTree(ctx.tree_data, global.current_wood_lot)
    } else {
        hammaringTree(tree_id, global.trees_database.trees[tree_id], mark_hammer_config, global.current_wood_lot)
        treeAnnouncement(ctx.player.username, "pointeur", tree_id)
    }

    return tree_id
}


function handleMarkingEvent(ctx, mark_type) {

    let mark_config = loadConfigData("globalforestconfig").treeMark
    if (mark_type == "futur") {
        return _goMeasureforMark(ctx, mark_config.futur)
    }
    if (mark_type == "right_arrow") {
        return _setArrow(ctx)
    }

    if (mark_type == "left_arrow") {
        return _setArrow(ctx)
    }

    if (mark_type == "abandon") {
        return _goMeasureforMark(ctx, mark_config.abandon)
    }

}

function _goMeasureforMark(ctx, mark_config) {
    if (!mark_config) return null

    let tree_id = measureTree(ctx.tree_data)

    if (!tree_id || !global.trees_database.trees[tree_id]) {return null}

    if (ctx.sneaking) {
        reserveMarkedTree(tree_id)
    } else {
        markTree(tree_id, global.trees_database.trees[tree_id], mark_config)
    }
    // treeAnnouncement(ctx.player.username, "pointeur", tree_id)
    return tree_id
}


function _setArrow(ctx) {

    let id = measureTree(ctx.tree_data)

    if (!id || !global.trees_database.trees[id]) {
        return null
    }

    if (ctx.sneaking) {
        reserveMarkedTree(id)
        return id
    }

    let right_data = {

        "north": {
            "offset": [0, 0, -1],
            "block": "kubejs:blue_right_arrow[facing=north]"
        },

        "south": {
            "offset": [0, 0, 1],
            "block": "kubejs:blue_right_arrow[facing=south]"
        },

        "east": {
            "offset": [1, 0, 0],
            "block": "kubejs:blue_right_arrow[facing=east]"
        },

        "west": {
            "offset": [-1, 0, 0],
            "block": "kubejs:blue_right_arrow[facing=west]"
        }
    }

    let left_data = {

        "north": {
            "offset": [0, 0, -1],
            "block": "kubejs:blue_left_arrow[facing=north]"
        },

        "south": {
            "offset": [0, 0, 1],
            "block": "kubejs:blue_left_arrow[facing=south]"
        },

        "east": {
            "offset": [1, 0, 0],
            "block": "kubejs:blue_left_arrow[facing=east]"
        },

        "west": {
            "offset": [-1, 0, 0],
            "block": "kubejs:blue_left_arrow[facing=west]"
        }
    }

    let mark

    if (global.blue_mark_type == "right_arrow"){
        mark = right_data[ctx.facing]
    }

    if (global.blue_mark_type == "left_arrow"){
        mark = left_data[ctx.facing]
    }

    let tree_pos = global.trees_database.trees[id]

    let dx = mark.offset[0]
    let dy = mark.offset[1] + 2
    let dz = mark.offset[2]

    addTreeMark(`${tree_pos.posx + dx} ${tree_pos.posy + dy} ${tree_pos.posz + dz}`, mark.block)

    return id
}