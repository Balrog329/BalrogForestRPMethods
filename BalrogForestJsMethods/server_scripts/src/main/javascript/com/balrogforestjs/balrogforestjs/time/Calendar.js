

function calendar() {

    let event = global.calendar.month
        .get(String(global.server_date.month))
        .get(String(global.server_date.day))

    if (event) {
        messageChat(Utils.server, event.label)

        for (let func of event.action) {
            console.info(func)
            func()
        }
    }
}

function test() {
    messageChat(Utils.server, "test")
}