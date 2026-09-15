package com.balrogforestjv.balrogforestjv;

import com.balrogforestjv.balrogforestjv.commands.CommandRegistry;
import com.balrogforestjv.balrogforestjv.utils.ModLogger;
import com.balrogforestjv.balrogforestjv.cache.BalrogCacheLoader;
import com.mojang.logging.LogUtils;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.RegisterCommandsEvent;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.event.server.ServerStartedEvent;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.Level;
import org.slf4j.Logger;

import java.io.IOException;

@Mod(BalrogForestJv.MODID)
public class BalrogForestJv {
    public static final String MODID = "balrogforestjv";

    public static final SpeciesConfigResolver CONFIG = SpeciesConfigResolver.getInstance();

    public BalrogForestJv() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        // On enregistre cette classe sur le bus d'événements global
        MinecraftForge.EVENT_BUS.register(this);

        ModLogger.info("Le pont Java BalrogForestJv pour Dynamic Trees est prêt !");
    }


    // On intègre l'événement DIRECTEMENT à l'intérieur de la classe principale
    @SubscribeEvent
    public void onServerStarted(ServerStartedEvent event) {
        ServerLevel overworld = event.getServer().getLevel(Level.OVERWORLD);
        if (overworld != null) {
            ServerContext.setServerLevel(overworld);
            ModLogger.info("Monde capturé avec succès pour TreeScanner !");
        }
        ServerGlobalEvents.postServerStartingEvent(event.getServer());

    }

    @SubscribeEvent
    public void onFertilityChange(DTFertilityChangeEvent event) {
        TreeFertilityManager.handleFertilityChange(event);
    }

    @SubscribeEvent
    public void onRegisterCommands(RegisterCommandsEvent event) {
        CommandRegistry.registerAll(event.getDispatcher());
    }
}
