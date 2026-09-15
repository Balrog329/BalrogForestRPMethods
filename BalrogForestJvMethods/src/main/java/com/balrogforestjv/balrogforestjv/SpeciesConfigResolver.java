package com.balrogforestjv.balrogforestjv;

import com.ferreusveritas.dynamictrees.tree.species.Species;
import com.balrogforestjv.balrogforestjv.utils.ModLogger;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.minecraftforge.fml.loading.FMLPaths;

import java.io.File;
import java.io.FileReader;
import java.nio.file.Path;

public class SpeciesConfigResolver {

    private static SpeciesConfigResolver instance;

    private final JsonObject config;

    private SpeciesConfigResolver() {
        this.config = loadConfig();
    }

    public static synchronized SpeciesConfigResolver getInstance() {
        if (instance == null) {
            instance = new SpeciesConfigResolver();
        }
        return instance;
    }

    private JsonObject loadConfig() {
        Path gameDir = FMLPaths.GAMEDIR.get();
        File file = gameDir.resolve("kubejs/config/balrogforestconfig/species_config.json").toFile();

        if (!file.exists()) {
            ModLogger.warn("Config introuvable : {}", file.getAbsolutePath());
            return new JsonObject();
        }

        try (FileReader reader = new FileReader(file)) {
            return JsonParser.parseReader(reader).getAsJsonObject();
        } catch (Exception e) {
            ModLogger.error("Erreur chargement JSON", e);
            return new JsonObject();
        }
    }
    
    public JsonObject getSpeciesData(String speciesName) {
        if (config == null || !config.has(speciesName)) {
            return null;
        }
        return config.getAsJsonObject(speciesName);
    }

    // Version avec Species
    public JsonObject getSpeciesData(Species species) {
        return getSpeciesData(species.getRegistryName().toString());
    }

    // ------------------------------------------------------------
    // Ton ancienne méthode reste utilisable
    // ------------------------------------------------------------
    public double getProbability(Species species) {
        JsonObject data = getSpeciesData(species);
        if (data == null || !data.has("death_proba")) {
            return 0.0;
        }
        return data.get("death_proba").getAsDouble();
    }
}
