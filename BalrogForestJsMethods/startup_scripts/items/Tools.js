
// Lecture des outils
const itemsConfig = JsonIO.read('kubejs/config/items/tools.json')

StartupEvents.registry('item', event => {

    itemsConfig.items.forEach(item => {

        let builder = event.create(
            item.id,
            item.type || 'basic'
        )

        builder.displayName(item.displayName)

        if (item.texture) {
            builder.texture(item.texture)
        }

        if (item.maxStackSize !== undefined) {
            builder.maxStackSize(item.maxStackSize)
        }

        if (item.glow !== undefined) {
            builder.glow(item.glow)
        }

        if (item.fireResistant !== undefined) {
            builder.fireResistant(item.fireResistant)
        }

        if (item.rarity) {
            builder.rarity(item.rarity)
        }

        if (item.tooltip) {
            item.tooltip.forEach(line => {
                builder.tooltip(line)
            })
        }

        // Configuration des outils
        if (['sword', 'pickaxe', 'axe', 'shovel', 'hoe'].includes(item.type)) {

            if (item.tier) {
                builder.tier(item.tier)
            }

            if (item.attackDamageBonus !== undefined) {
                builder.attackDamageBonus(item.attackDamageBonus)
            }

            if (item.speed !== undefined) {
                builder.speed(item.speed)
            }
        }
    })

})