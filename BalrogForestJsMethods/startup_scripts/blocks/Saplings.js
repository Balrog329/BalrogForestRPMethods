
const saplings = JsonIO.read('kubejs/config/blocks/saplings.json')

StartupEvents.registry('block', event => {

    saplings.saplings.forEach(sapling => {

        event.create(`${sapling.id}_sapling`)
            .displayName(sapling.displayName)
            .soundType('grass')
            .hardness(0)
            .resistance(0)
            .noCollision()
            .notSolid()
            .opaque(false)
            .transparent(true)
            .defaultCutout()
            .model(sapling.model)

    })

})