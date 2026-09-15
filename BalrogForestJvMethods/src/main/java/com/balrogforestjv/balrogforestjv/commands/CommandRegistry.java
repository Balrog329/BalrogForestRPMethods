package com.balrogforestjv.balrogforestjv.commands;

import com.balrogforestjv.balrogforestjv.commands.impl.FertilityProcessCommand;
import com.balrogforestjv.balrogforestjv.utils.ModLogger;
import com.mojang.brigadier.CommandDispatcher;
import net.minecraft.commands.CommandSourceStack;

import java.util.ArrayList;
import java.util.List;

public class CommandRegistry {

    private static final List<IModCommand> COMMANDS = new ArrayList<>();

    // On déclare toutes les commandes du mod ici
    static {
        registerCommand(new FertilityProcessCommand());
        // Quand tu auras une nouvelle commande :
        // registerCommand(new MaNouvelleCommande());
    }

    private static void registerCommand(IModCommand command) {
        COMMANDS.add(command);
    }

    public static void registerAll(CommandDispatcher<CommandSourceStack> dispatcher) {
        for (IModCommand command : COMMANDS) {
            command.register(dispatcher);
        }
        ModLogger.info("Toutes les commandes BalrogForest ont été enregistrées ({})", COMMANDS.size());
    }
}