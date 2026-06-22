package com.balrogforestjv.balrogforestjv;

import com.mojang.logging.LogUtils;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.event.server.ServerStartedEvent;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.Level;
import org.slf4j.Logger;

@Mod(BalrogForestJv.MODID)
public class BalrogForestJv {
    public static final String MODID = "balrogforestjv";
    private static final Logger LOGGER = LogUtils.getLogger();

    public BalrogForestJv() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        // On enregistre cette classe sur le bus d'événements global
        MinecraftForge.EVENT_BUS.register(this);

        LOGGER.info("Le pont Java BalrogForestJv pour Dynamic Trees est prêt !");
    }

    // On intègre l'événement DIRECTEMENT à l'intérieur de la classe principale
    @SubscribeEvent
    public void onServerStarted(ServerStartedEvent event) {
        ServerLevel overworld = event.getServer().getLevel(Level.OVERWORLD);
        if (overworld != null) {
            ServerContext.setServerLevel(overworld);
            LOGGER.info("Monde capturé avec succès pour TreeScanner !");
        }
    }
}