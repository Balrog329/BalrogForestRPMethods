package com.balrogforestjv.balrogforestjv.commands;

import com.mojang.brigadier.CommandDispatcher;
import net.minecraft.commands.CommandSourceStack;

public interface IModCommand {
    void register(CommandDispatcher<CommandSourceStack> dispatcher);
}