package com.balrogforestjv.balrogforestjv.cache;

import com.balrogforestjv.balrogforestjv.directory.ServerDirectoryManager;
import net.minecraft.server.MinecraftServer;

import java.io.IOException;
import java.nio.file.Path;

public final class BalrogCacheLoader {

    private static final String MAP_FOLDER = "balrogdata";

    private static BalrogCacheLoader cachedData;
    private static Path cachedDirectory;

    private BalrogCacheLoader() {
    }

    /**
     * Charge les bdd dat en cache
     * Pour le moment : crée simplement le dossier et stocke son chemin.
     */
    public static BalrogCacheLoader load(MinecraftServer server) throws IOException {

        // Création du dossier si nécessaire
        cachedDirectory = ServerDirectoryManager.getOrCreateSubFolder(
                server,
                MAP_FOLDER
        );

        // Singleton : on crée l’instance si elle n’existe pas
        if (cachedData == null) {
            cachedData = new BalrogCacheLoader();
        }

        return cachedData;
    }

    public static Path getDirectory() {
        return cachedDirectory;
    }
}
