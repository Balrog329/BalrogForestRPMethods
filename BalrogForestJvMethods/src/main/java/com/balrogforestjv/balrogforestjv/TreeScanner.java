package com.balrogforestjv.balrogforestjv;

import net.minecraft.server.level.ServerLevel;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.LevelAccessor;
import net.minecraft.resources.ResourceLocation;
import net.minecraftforge.registries.ForgeRegistries;

import com.ferreusveritas.dynamictrees.api.TreeHelper;
import com.ferreusveritas.dynamictrees.block.branch.BranchBlock;
import com.ferreusveritas.dynamictrees.tree.species.Species;
import com.ferreusveritas.dynamictrees.api.network.MapSignal;
import com.ferreusveritas.dynamictrees.api.network.NodeInspector;

public class TreeScanner {

    public static TreeData scanTree(BlockPos pos) {
        ServerLevel level = ServerContext.getServerLevel();
        if (level == null) return new TreeData("none", 0, 0, 0, "none");

        BlockState state = level.getBlockState(pos);
        BranchBlock branchBlock = TreeHelper.getBranch(state);
        if (branchBlock == null) return new TreeData("none", 0, 0, 0, "none");

        // Trouver la racine et son type de bloc
        BlockPos rootPos = TreeHelper.findRootNode(level, pos);
        BlockState rootState = level.getBlockState(rootPos);
        String rootyBlockName = "unknown";

        if (TreeHelper.isRooty(rootState)) {
            ResourceLocation res = ForgeRegistries.BLOCKS.getKey(rootState.getBlock());
            if (res != null) {
                rootyBlockName = res.toString();
            }
        }

        // Trouver l'essence
        Species species = TreeHelper.getBestGuessSpecies(level, pos);
        String speciesName = (species != null && species.getRegistryName() != null)
                ? species.getRegistryName().toString() : "unknown";

        TreeData data = new TreeData(speciesName, rootPos.getX(), rootPos.getY(), rootPos.getZ(), rootyBlockName);

        // Collecteur passif
        NodeInspector branchCollector = new NodeInspector() {
            @Override
            public boolean run(BlockState blockState, LevelAccessor world, BlockPos blockPos, Direction fromDir) {
                if (TreeHelper.isBranch(blockState)) {
                    int radius = TreeHelper.getRadius(world, blockPos);

                    double rawVoxelVolume = radius * radius * 64;
                    double officialSegmentVolume = rawVoxelVolume / 4096.0;

                    data.branch.add(new TreeData.BranchInfo(
                            blockPos.getX(),
                            blockPos.getY(),
                            blockPos.getZ(),
                            radius,
                            officialSegmentVolume
                    ));
                    
                    data.volume_total += officialSegmentVolume;
                }
                return false;
            }

            @Override
            public boolean returnRun(BlockState blockState, LevelAccessor world, BlockPos blockPos, Direction fromDir) {
                return false;
            }
        };

        // Lancement de l'analyse globale
        MapSignal signal = new MapSignal(branchCollector);
        TreeHelper.startAnalysisFromRoot(level, rootPos, signal);

        return data;
    }
}