
function advencementBar(event, max, number) {
    let prc = (number / max) * 100
    let prc_rounded = Math.round(prc)

    if (prc_rounded % 10 === 0) {
        messageChat(Utils.server, `§2§l--> ${event} état d'avancement : ${prc_rounded} %`)
    }
}