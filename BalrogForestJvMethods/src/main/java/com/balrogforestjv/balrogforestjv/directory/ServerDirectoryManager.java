package com.balrogforestjv.balrogforestjv.directory;

import com.balrogforestjv.balrogforestjv.utils.ModLogger;
import net.minecraft.server.MinecraftServer;
import net.minecraft.world.level.storage.LevelResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ServerDirectoryManager {

    /**
     * Récupère le dossier de la sauvegarde du monde en cours (ex: ./saves/test/).
     *
     * @param server L'instance du MinecraftServer
     * @return Le Path vers le dossier de la sauvegarde du monde
     */
    public static Path getServerDirectory(MinecraftServer server) {
        return server.getWorldPath(LevelResource.ROOT);
    }

    /**
     * Récupère le chemin d'un sous-dossier dans le répertoire du monde actuel.
     * Si le dossier n'existe pas, il sera automatiquement créé.
     *
     * @param server L'instance du MinecraftServer
     * @param folderName Le nom du sous-dossier à créer/récupérer
     * @return Le Path complet vers le sous-dossier
     */
    public static Path getOrCreateSubFolder(MinecraftServer server, String folderName) {
        Path serverDir = getServerDirectory(server);
        Path subFolder = serverDir.resolve(folderName);

        if (Files.notExists(subFolder)) {
            try {
                Files.createDirectories(subFolder);
                ModLogger.info("Dossier créé avec succès : {}", subFolder.toAbsolutePath());
            } catch (IOException e) {
                ModLogger.error("Impossible de créer le dossier : {}", subFolder.toAbsolutePath(), e);
            }
        }

        return subFolder.toAbsolutePath();
    }
}