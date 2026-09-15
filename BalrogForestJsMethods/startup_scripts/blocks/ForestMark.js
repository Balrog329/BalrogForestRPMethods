
const blocksConfig = JsonIO.read('kubejs/config/blocks/mark_block.json')

StartupEvents.registry('block', event => {

    blocksConfig.blocks.forEach(block => {

        event.create(block.id)
            .displayName(block.displayName)
            .soundType('wood')
            .hardness(1)
            .resistance(1)
            .noCollision()
            .notSolid()
            .opaque(false)
            .transparent(true)
            .defaultCutout()
            .model(block.model)
            .property(BlockProperties.FACING)

    })

})