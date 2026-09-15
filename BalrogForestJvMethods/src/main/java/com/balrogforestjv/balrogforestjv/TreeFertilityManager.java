package com.balrogforestjv.balrogforestjv;

import com.balrogforestjv.balrogforestjv.utils.ModLogger;
import com.ferreusveritas.dynamictrees.api.TreeHelper;
import com.ferreusveritas.dynamictrees.api.network.MapSignal;
import com.ferreusveritas.dynamictrees.api.treedata.TreePart;
import com.ferreusveritas.dynamictrees.block.rooty.RootyBlock;
import com.ferreusveritas.dynamictrees.systems.nodemapper.DiseaseNode;
import com.ferreusveritas.dynamictrees.tree.species.Species;
import com.google.gson.JsonObject;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;

import static com.balrogforestjv.balrogforestjv.BalrogForestJv.CONFIG;

public class TreeFertilityManager {

    public static final ThreadLocal<Boolean> IS_MODIFYING_FERTILITY = ThreadLocal.withInitial(() -> false);

    public static void handleFertilityChange(DTFertilityChangeEvent event) {
        // Si le processus est désactivé via la commande, on ne fait rien
        if (!BalrogForestConfig.isFertilityProcessEnabled()) {
            return;
        }
        Species species = event.getSpecies();

        if (species == null) return;

        String speciesId = species.getRegistryName().toString();
        JsonObject speciesData = CONFIG.getSpeciesData(species);

        if (speciesData == null) {
            ModLogger.warn("[BalrogForest] Échec de résolution pour l'arbre : '{}'. (Nom dans DynamicTrees = '{}')",
                    species, speciesId);
            return;
        }
        int deathMinFertility = speciesData.get("death_min_fertility").getAsInt();
        ModLogger.info(String.valueOf(deathMinFertility));
        if (event.getOldFertility() >= deathMinFertility ) {
            return;
        }

        double deathProba = speciesData.get("death_proba").getAsDouble();
        boolean shouldDie = Math.random() < deathProba;
        int targetFertility = shouldDie ? 0 : 15;

        // Si la fertilité est déjà égale à la cible, on annule l'événement pour éviter toute modif
        if (event.getOldFertility() == targetFertility) {
            event.setCanceled(true);
            return;
        }

        RootyBlock soil = event.getSoil();
        Level level = event.getLevel();
        BlockPos rootPos = event.getRootPos();

        if (soil != null && level != null && rootPos != null) {
            try {
                IS_MODIFYING_FERTILITY.set(true);

                ModLogger.info("[BalrogForest] Fertilité sous 7 détectée ({}) ! Application de la fertilité {} pour {} en {}",
                        event.getOldFertility(), targetFertility, species.getRegistryName(), rootPos);

                // On applique la fertilité cible (0 ou 15)
                soil.setFertility(level, rootPos, targetFertility);

                // Si l'arbre doit mourir (fertilité = 0)
                if (targetFertility == 0) {
                    BlockPos treePos = rootPos.above();
                    BlockState treeState = level.getBlockState(treePos);
                    TreePart treePart = TreeHelper.getTreePart(treeState);

                    if (treePart != TreeHelper.NULL_TREE_PART) {
                        // Déclenchement de la mort native via DiseaseNode
                        treePart.analyse(
                                treeState,
                                level,
                                treePos,
                                Direction.DOWN,
                                new MapSignal(new DiseaseNode(species))
                        );
                        ModLogger.info("[BalrogForest] Arbre supprimé avec succès via DiseaseNode à {}", treePos);
                    }
                }

                // On annule l'événement d'origine pour bloquer l'écriture par défaut de Dynamic Trees
                event.setCanceled(true);

            } finally {
                IS_MODIFYING_FERTILITY.set(false);
            }
        }
    }
}