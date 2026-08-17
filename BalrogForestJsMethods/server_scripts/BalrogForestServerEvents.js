let counter = 0

ServerEvents.tick(event => {

    counter++

    const server = event.server

    server.players.forEach(player => {
        global.player = player
    })

    if (counter == 1200) {
        server.players.forEach(player => {
            saveCachedData(player)
        })
    }

    if (counter < 6000) {return}

    counter = 0

    server.players.forEach(player => {

            if (getMcDimension(player) !== "minecraft:overworld") {return}

            summonEntity(server, player)

    })

})



var cut_type = ["amelioration_resineuse",
    "amelioration_feuillue",
    "eclaircie_de_taillis",
    "coupe_jardinatoire_feuillue",
    "coupe_jardinatoire_resineuse",
    "coupe_rase",
    "releve_de_couvert",
    "None",
    "coupe_ensemencement",
    "coupe_secondaire",
    "coupe_definitive",
    "coupe_cloisonnement",
    "extraction_resineuse",
    "extraction_feuillue"
]

var wood_lot_status = [
    null, "for_sale", "sold", "pending", "cut"
]

var tree_actions = [
    "measure", "hammering", "marking"
]

var cacheddataname = [
    "TreesDatabase"
]


global.getLegalEntityIds = function() {
    return Object.keys(loadLegalEntity())
}

global.getTreeSpeciesIds = function(player) {
    return Object.keys(loadConfigData(player, "speciesdata"))
}


const IntegerArgumentType = Java.loadClass('com.mojang.brigadier.arguments.IntegerArgumentType')
const BoolArgumentType = Java.loadClass('com.mojang.brigadier.arguments.BoolArgumentType')
const StringArgumentType = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType')
const DoubleArgumentType = Java.loadClass('com.mojang.brigadier.arguments.DoubleArgumentType')

const bf_commands = {

    bf_createwoodlot: {
        args: [
            {
                name: "type",
                type: StringArgumentType.word(),
                suggestions: cut_type
            },
            {
                name: "id",
                type: StringArgumentType.word()
            }
        ],

        run: (ctx, args) => {

            const player = ctx.source.player

            if (!cut_type.includes(args.type)) {
                messageChat(global.player, "Type de coupe invalide")
                return
            }

            global.current_wood_lot = args.id
            console.info(`[BWFM] Lot de coupe défini : ${args.id} (${args.type})`)
            let pos_data = global.treePosMetadata(global.player, global.player)
            let lot = createNewLot(global.player, global.treePosMetadata(global.player, global.player), args.type, args.id)

           messageChat(global.player, `Lot de coupe défini : ${args.id} (${args.type})`)
        }
    },

    bf_setwoodlot: {
        args: [
            { name: 'year', type: IntegerArgumentType.integer(2000, 2028) },
            {name: 'id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                console.info(`[BWFM] Récupération des lots pour l'année ${IntegerArgumentType.getInteger(ctx, "year")}`)

                const player = ctx.source.player
                const year = IntegerArgumentType.getInteger(ctx, "year")
                const lots = global.getLots(player, year)
                return lots
            }
            
            }
        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            
            global.current_wood_lot = args.id

            messageChat(player, `Lot défini : ${global.current_wood_lot} (${args.year})`)
        }

    },

    bf_pay: {
        args: [
            {
                name: 'from',
                type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {
                name: 'to',
                type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {
                name: 'amount',
                type: IntegerArgumentType.integer()
            }
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            transaction(args.from, args.to, args.amount)
            messageChat(player, `Transaction de ${args.amount} Z sur ${args.to}`)
        }
    },

    bf_getwoodprice: {
        args: [
            {
                name: 'species',
                type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))
                }
            }
        ],

        run: (ctx, args) => {
            const player = ctx.source.player

            const species = args.species.replace("_", ":")

            const price = getTreeLogDynamicPrice(player, species)

            messageChat(player, `Prix courant : ${price} Z m3`)
        }

    }, 

    bf_buywoodlot: {
        args: [
            {name: 'lot_id',type: StringArgumentType.word(), suggestions: [global.current_wood_lot]}
        ],

        run: (ctx, args) => {
            const player = ctx.source.player

            const redemption_price = putLotOnMarket(player, args.lot_id)

        }

    },

    bf_startlotexploitation : {
        args: [
            {name: 'lot_id',type: StringArgumentType.word(), suggestions: [global.current_wood_lot]}
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            lotExploitation(player, args.lot_id)
            
        }

    },

    bf_giveforestworkquote : {
        args: [{name: 'work_type', type: StringArgumentType.word(), suggestions: global.getForestWork()},
            {name: 'surface', type: DoubleArgumentType.doubleArg(0,1000)},
            {name: 'parcel', type: StringArgumentType.word()}
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            buildForestQuote(player, args.work_type, args.parcel, args.surface)

        }
    },
    bf_acceptforestworkquote: {
        args: [
            { name: 'year', type: IntegerArgumentType.integer(2000, 2028) },
            {name: 'id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    console.info(`[BWFM] Récupération des devis pour l'année ${IntegerArgumentType.getInteger(ctx, "year")}`)

                    const player = ctx.source.player
                    const year = IntegerArgumentType.getInteger(ctx, "year")
                    const quotes = global.getQuotes(player, year)
                    return quotes
                }

            }
        ],
        run: (ctx, args) => {
            const player = ctx.source.player

            global.current_quotes = args.id
            acceptQuotes(player, args.id)
        }

    },
    bf_startcutmarkedtree: {
        args: [{ name: 'parcel', type: IntegerArgumentType.integer(0,500) }],
        run: (ctx, args) => {
            const player = ctx.source.player
            markedTreeExploitation(player, args.parcel)
        }

    },

    bf_forestinfo : {
        args: [],
        run: (ctx, args) => {
            const player = ctx.source.player
            global.forestInfo(player)
        }
    },

    bf_forestbook : {
        args: [{ name: 'year', type: IntegerArgumentType.integer(2000,2028)}],
        run: (ctx, args) => {
            const player = ctx.source.player
            printManagementBookInChat(player, args.year)
        }
    },
    bf_forestnote :{
        args: [{name: 'parcel', type:IntegerArgumentType.integer(1,500)},
                {name: 'note', type: StringArgumentType.word()}
        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            let pos_data = global.treePosMetadata(player, player)
            const now = new Date()
            const id = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}h${now.getMinutes()}`
            addInManagementBook(player, id, "note", pos_data.year, args.parcel, args.desc)
            messageChat(player, `Note ajoutée`)
        }
    },
    bf_deleteforestnote : {
        args: [
            {name: 'parcel', type:IntegerArgumentType.integer(1,500)},
            {name: 'id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    return searchByParcelInManagementBook(IntegerArgumentType.getInteger(ctx, "parcel"))
                }
            }
        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            deleteInManagementBook(player, args.id)
        }
    },

    bf_treesaction : {
        // effectue une action donnée sur tout les arbres dans un rayon donné
        args: [
            {name: 'action', type: StringArgumentType.word(), suggestions: tree_actions},
            {name: 'radius', type: IntegerArgumentType.integer(0,500)},
            {name: 'species', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))}}
            ],

        run: (ctx, args) => {
            const player = ctx.source.player
            const species = global.normalizeSpecies(args.species)
            let trees_ids = treesAction(player, args.action, args.radius, species)
            messageChat(player, `Opération terminé ${trees_ids.length} arbre(s) mesuré(s)`)
        }
    },

    bf_forestexpertise : {
        // Donne un rapport d'expertise sur une parcelle donnée
        args : [{name: 'parcel', type: IntegerArgumentType.integer(0,500)}],
        run: (ctx, args) => {
            const player = ctx.source.player
            forestExpertise(player, args.parcel)
        }
    },
    bf_savecacheddata : {
        args : [],
        run: (ctx, args) => {
            const player = ctx.source.player
            saveCachedData(player)
        }
    },

    bf_dtspeciestodtspecies : {
        // essaye de convertir une espèce d'arbre vers une autre via WE
        args: [
            {name: 'radius', type: IntegerArgumentType.integer(0,500)},
            {name: 'species1', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))}},
            {name: 'species2', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))}}

        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            const species1 = args.species1.replace("_", ":")
            const species2 = args.species2.replace("_", ":")
            dtSpecieToDtSpecie(player, args.radius, species1, species2)
        }
    },
}


function buildCommand(Commands, name, cmd) {
    let execution = (ctx) => {
        let args = {}

        for (let arg of cmd.args || []) {
            if (arg.type.getClass().getSimpleName().includes('Integer'))
                args[arg.name] = IntegerArgumentType.getInteger(ctx, arg.name)
            else if (arg.type.getClass().getSimpleName().includes('Bool'))
                args[arg.name] = BoolArgumentType.getBool(ctx, arg.name)
            else if (arg.type.getClass().getSimpleName().includes("String"))
                args[arg.name] = StringArgumentType.getString(ctx, arg.name)
            else if (arg.type.getClass().getSimpleName().includes("Double"))
                args[arg.name] = DoubleArgumentType.getDouble(ctx, arg.name)

        }

        cmd.run(ctx, args)
        return 1
    }

    let node = Commands.literal(name)
        .requires(source => source.hasPermission(2))

    if (!cmd.args || cmd.args.length === 0) {
        return node.executes(execution)
    }

    let last = buildArgument(
        Commands,
        cmd.args[cmd.args.length - 1],
        null,
        execution
    )

    for (let i = cmd.args.length - 2; i >= 0; i--) {
        last = buildArgument(
            Commands,
            cmd.args[i],
            last,
            execution
        )
    }

    return node.then(last)
}

ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event

    for (let name in bf_commands) {
        event.register(buildCommand(Commands, name, bf_commands[name]))
    }
})


function buildArgument(Commands, arg, child, execution) {

    let node = Commands.argument(arg.name, arg.type)

    if (arg.suggestions) {
        node = node.suggests((ctx, builder) => {

            const values = typeof arg.suggestions === "function"
                ? arg.suggestions(ctx)
                : arg.suggestions

            for (const value of values) {
                if (String(value).toLowerCase().startsWith(builder.getRemainingLowerCase())) {
                    builder.suggest(String(value))
                }
            }

            return builder.buildFuture()
        })
    }

    if (child)
        node.then(child)
    else
        node.executes(execution)

    return node
}