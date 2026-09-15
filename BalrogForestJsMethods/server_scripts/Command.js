

var cut_type = [
    "amelioration_resineuse",
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

var tree_actions = [
    "measure", "hammering", "marking"
]

var brush_list = [
    'brushCutConiferous',
    'brushCutBroadleaf',
    'brushClearing',
    'brushGrinding',
    'soilPreparation',
    'brushTripwirePath',
    'brushCutCustomConiferous',
    'brushCutCustomDecidious'
]

var entities_activities = [
    'agri',
    'wood_buyer',
    'manager',
    'player'
]


global.getLegalEntityIds = function() {
    return Object.keys(global.entities)
}

global.getTreeSpeciesIds = function() {
    return Object.keys(global.species_config)
}


const IntegerArgumentType = Java.loadClass('com.mojang.brigadier.arguments.IntegerArgumentType')
const BoolArgumentType = Java.loadClass('com.mojang.brigadier.arguments.BoolArgumentType')
const StringArgumentType = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType')
const DoubleArgumentType = Java.loadClass('com.mojang.brigadier.arguments.DoubleArgumentType')

// usage : 'property'
var property_args = {name: 'property', type: StringArgumentType.word(), suggestions: (ctx) => {return getserverProprietiesArray()}}

// usage : 'parcel'
var parcel_args = {name: 'parcel', type: StringArgumentType.word(), suggestions: (ctx) => {return getNumProprietiesParcel(StringArgumentType.getString(ctx, "proprieties"))}}


// usage : 'surface'
var surface_args = {name: 'surface', type: DoubleArgumentType.doubleArg(0, 1000)}

const bf_commands = {

    // Création de lot de bois
    bf_createwoodlot: {
        args: [
            {name: "type", type: StringArgumentType.word(), suggestions: cut_type},
            {name: "id", type: StringArgumentType.word()}
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            if (!cut_type.includes(args.type)) {
                messageChat(player, "Type de coupe invalide")
                return
            }

            console.info(`[BWFM] Lot de coupe défini : ${args.id} (${args.type})`)
            createNewLot(player, args.type, args.id)

            messageChat(Utils.server, `Lot de coupe défini : ${args.id} (${args.type})`)
        }
    },

    // définition du lot de bois courant
    bf_setwoodlot: {
        args: [
            {name: 'year', type: IntegerArgumentType.integer()},
            {name: 'id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    console.info(`[BWFM] Récupération des lots pour l'année ${IntegerArgumentType.getInteger(ctx, "year")}`)

                    const player = ctx.source.player
                    return global.getLots(IntegerArgumentType.getInteger(ctx, "year"))
                }

            }
        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            global.current_wood_lot = args.id

            messageChat(Utils.server, `Lot défini : ${global.current_wood_lot} (${args.year})`)
        }

    },

    bf_pay: {
        args: [
            {name: 'to', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {name: 'amount', type: IntegerArgumentType.integer()}
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            transaction(player.username, args.to, args.amount)
            messageChat(player, `Transaction de ${args.amount} Z sur ${args.to}`)
        }
    },

    // prix courant d'une essence

    bf_getwoodprice: {
        args: [
            {name: 'species', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds().map(s => s.replace(":", "_"))
                }
            }
        ],

        run: (ctx, args) => {
            const player = ctx.source.player

            const species = args.species.replace("_", ":")

            const price = getTreeLogDynamicPrice(species, undefined, false)

            messageChat(player, `Prix courant : ${price} Z m3`)
        }

    },

    bf_buywoodlot: {
        args: [
            {name: 'year', type: IntegerArgumentType.integer()},
            {
                name: 'lot_id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    return global.getLots(IntegerArgumentType.getInteger(ctx, "year"))
                }

            }
        ],

        run: (ctx, args) => {
            const player = ctx.source.player

            putLotOnMarket(args.lot_id)

        }

    },

    bf_startlotexploitation: {
        args: [
            {name: 'year', type: IntegerArgumentType.integer()},
            {
                name: 'lot_id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    return global.getLots(IntegerArgumentType.getInteger(ctx, "year"))
                }

            }
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            lotExploitation(player, args.lot_id)

        }

    },

    bf_giveforestworkquote: {
        args: [property_args,
            {name: 'work_type', type: StringArgumentType.word(), suggestions: global.getForestWork()},
            surface_args,
            parcel_args
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            buildForestQuote(player, args.property, args.work_type, args.parcel, args.surface)

        }
    },
    bf_acceptforestworkquote: {
        args: [
            {name: 'year', type: IntegerArgumentType.integer()},
            {
                name: 'id', type: StringArgumentType.word(),
                suggestions: (ctx) => {
                    console.info(`[BWFM] Récupération des devis pour l'année ${IntegerArgumentType.getInteger(ctx, "year")}`)

                    const player = ctx.source.player
                    return global.getQuotes(player, IntegerArgumentType.getInteger(ctx, "year"))
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
        args: [property_args,
            {name: 'parcel', type: StringArgumentType.word(), suggestions: (ctx) => {return getNumProprietiesParcel(StringArgumentType.getString(ctx, "proprieties"))}}
        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            markedTreeExploitation(player, args.property, args.parcel)
        }

    },

    bf_proprietiesinfo: {
        args: [],
        run: (ctx, args) => {
            const player = ctx.source.player
            global.forestInfo(player)
        }
    },

    bf_forestbook: {
        args: [{name: 'year', type: IntegerArgumentType.integer(2000, 2028)}],
        run: (ctx, args) => {
            const player = ctx.source.player
            printManagementBookInChat(player, args.year)
        }
    },
    bf_forestnote: {
        args: [
            property_args,
            parcel_args,
            {name: 'note', type: StringArgumentType.word()}
        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            const now = new Date()
            const id = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}h${now.getMinutes()}`
            addInManagementBook(id, "note", args.property, args.parcel, args.note)
            messageChat(player, 'Note ajoutée : ' + args.note)
        }
    },

    bf_treesaction: {
        // effectue une action donnée sur tout les arbres dans un rayon donné
        args: [
            {name: 'action', type: StringArgumentType.word(), suggestions: tree_actions},
            {name: 'radius', type: IntegerArgumentType.integer(0, 500)},
            {
                name: 'species', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))
                }
            }
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            const species = global.normalizeSpecies(args.species)
            let trees_ids = treesAction(player, args.action, args.radius, species)
            messageChat(player, `Opération terminé ${trees_ids.length} arbre(s) mesuré(s)`)
        }
    },

    bf_forestexpertise: {
        // Donne un rapport d'expertise sur une parcelle donnée
        args: [{name: 'parcel', type: IntegerArgumentType.integer(0, 500)}],
        run: (ctx, args) => {
            const player = ctx.source.player
            forestExpertise(player, args.parcel)
        }
    },
    bf_savecacheddata: {
        args: [],
        run: (ctx, args) => {
            const player = ctx.source.player
            saveCachedData()
        }
    },

    bf_dtspeciestodtspecies: {
        // essaye de convertir une espèce d'arbre vers une autre via WE
        args: [
            {name: 'radius', type: IntegerArgumentType.integer(0, 500)},
            {name: 'species1', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))
                }
            },
            {
                name: 'species2', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getTreeSpeciesIds(ctx.source.player).map(s => s.replace(":", "_"))
                }
            }

        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            const species1 = args.species1.replace("_", ":")
            const species2 = args.species2.replace("_", ":")
            dtSpecieToDtSpecie(args.radius, species1, species2)
        }
    },

    bf_adminbrush: {
        args: [
            {name: 'radius', type: IntegerArgumentType.integer(0, 500)},
            {name: 'func', type: StringArgumentType.word(), suggestions: brush_list}
        ],
        run: (ctx, args) => {
            setBrush(ctx.source.player, args.radius, args.func)
        }
    },

    bf_adminforestlotsale:{
        args: [],
        run: (ctx, args) => {
            const player = ctx.source.player
            global.forestExpertLotSold()
        }
    },
    bf_adminnewentities:{
        args: [
            {name: 'activ', type: StringArgumentType.word(), suggestions: entities_activities},
            {name: 'name', type: StringArgumentType.word()},
            {name: 'administrator', type: StringArgumentType.word()},
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            newEntities(args.name, args.activ, args.administrator)
        }
    },
    bf_admintransaction: {
        args: [
            {name: 'from', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {name: 'to', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {name: 'amount', type: IntegerArgumentType.integer()}
        ],

        run: (ctx, args) => {
            const player = ctx.source.player
            transaction(args.from, args.to, args.amount)
            messageChat(player, `Transaction de ${args.amount} Z sur ${args.to}`)
        }
    },
    bf_adminnewproperty: {
        args: [{name: 'name', type: StringArgumentType.word()},
            {name: 'owner', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {name: 'manager', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            }
            ],
        run: (ctx, args) => {
            const player = ctx.source.player
            newProprety(args.name, args.owner, args.manager)
        }
    },
    bf_adminbuyproperty: {
        args: [
            property_args,
            {name: 'buyer', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },

            {name: 'new_manager', type: StringArgumentType.word(), suggestions: (ctx) => {
                    return global.getLegalEntityIds()
                }
            },
            {name: 'amount', type: IntegerArgumentType.integer()},

        ],
        run: (ctx, args) => {
            const player = ctx.source.player
            buyProperty(args.property,args.buyer, args.new_manager, args.amount)
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