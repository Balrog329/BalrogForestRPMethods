package com.balrogforestjv.balrogforestjv.commands.impl;

import com.balrogforestjv.balrogforestjv.BalrogForestConfig;
import com.balrogforestjv.balrogforestjv.commands.IModCommand;
import com.balrogforestjv.balrogforestjv.utils.ModLogger;
import com.mojang.brigadier.CommandDispatcher;
import com.mojang.brigadier.arguments.BoolArgumentType;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.commands.Commands;
import net.minecraft.network.chat.Component;

public class FertilityProcessCommand implements IModCommand {

    @Override
    public void register(CommandDispatcher<CommandSourceStack> dispatcher) {
        dispatcher.register(
                Commands.literal("balrogfertility")
                        .requires(source -> source.hasPermission(2))
                        .then(Commands.argument("enabled", BoolArgumentType.bool())
                                .executes(context -> {
                                    boolean enabled = BoolArgumentType.getBool(context, "enabled");
                                    BalrogForestConfig.setFertilityProcessEnabled(enabled);

                                    String status = enabled ? "activé" : "désactivé";
                                    context.getSource().sendSuccess(() ->
                                            Component.literal("§a[BalrogForest] Le processus de fertilité est désormais " + status + "."), true);

                                    ModLogger.info("Processus de fertilité passé à : {}", enabled);
                                    return 1;
                                })
                        )
        );
    }
}