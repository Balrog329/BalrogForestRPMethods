
const mobs = [

            // 5% of None
            {id: "naturalist:bluejay", chance: 0.20},
            {id: "exoticbirds:robin", chance: 0.20},
            {id: "exoticbirds:magpie", chance: 0.15},
            {id: "exoticbirds:woodpecker", chance: 0.15},
            {id: "alexsmobs:crow", chance: 0.05},
            {id: "wildernature:boar", chance: 0.06},
            {id: "wildernature:deer", chance: 0.02},
            {id: "wildernature:owl", chance: 0.02},
            {id: "wildernature:squirrel", chance: 0.01},
            {id: "naturalist:boar", chance: 0.05},
            {id: "naturalist:deer", chance: 0.02},                
            {id: "exoticbirds:owl", chance: 0.02},
        ]

        
let counter = 0

function pickMob() {
    let total = 0
    for (let m of mobs) total += m.chance

    let r = Math.random() * total
    let acc = 0

    for (let m of mobs) {
        acc += m.chance
        if (r <= acc) return m.id
    }

    return mobs[0].id
}

function summonEntity(server, player) {

        let mob = pickMob()
        let x = player.getBlock().x + (Math.random() * 100 - 50)
        let z = player.getBlock().z + (Math.random() * 100 - 50)
        let y = player.getBlock().y

        server.runCommandSilent(`summon ${mob} ${x} ${y} ${z}`)

        console.info(`${mob} was spawned at ${x} ${y} ${z}`)
        return { mob: mob, x: x, y: y, z: z }
}