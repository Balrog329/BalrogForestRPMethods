
ClientEvents.tick(event => {
    let player = event.player

    const companies = global.getAdminCompanies(player)

    const paintData = {}
    let y = -20

    // Titre
    paintData["admin_ui_title"] = {
        type: "text",
        text: "§6Solde",
        x: -2, y: y,
        scale: 0.7,
        alignX: "right",
        alignY: "center",
        draw: "ingame"
    }

    y += 12

    // Liste des entreprises
    companies.forEach((c, i) => {
        paintData[`admin_ui_${i}`] = {
            type: "text",
            text: `§7${c.abreviation}: §a${c.balance} Z`,
            x: -2, y: y,
            scale: 0.5,
            alignX: "right",
            alignY: "center",
            draw: "ingame"
        }
        y += 12
    })

    player.paint(paintData)

})