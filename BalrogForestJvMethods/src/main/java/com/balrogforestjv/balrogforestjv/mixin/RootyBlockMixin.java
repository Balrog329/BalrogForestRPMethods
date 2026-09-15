package com.balrogforestjv.balrogforestjv.mixin;

import com.balrogforestjv.balrogforestjv.DTFertilityChangeEvent;
import com.balrogforestjv.balrogforestjv.TreeFertilityManager;
import com.ferreusveritas.dynamictrees.block.rooty.RootyBlock;
import com.ferreusveritas.dynamictrees.tree.species.Species;
import net.minecraft.core.BlockPos;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraftforge.common.MinecraftForge;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(value = RootyBlock.class, remap = false)
public class RootyBlockMixin {

    @Inject(
            method = "setFertility",
            at = @At("HEAD"),
            cancellable = true
    )
    private void balrogforestjv$onSetFertility(
            Level level,
            BlockPos pos,
            int newFertility,
            CallbackInfo ci
    ) {
        // 1. Ne rien faire côté client
        if (level.isClientSide()) {
            return;
        }

        // 2. Anti-boucle : Si l'appel vient de notre propre manager, on laisse passer sans déclencher l'événement
        if (TreeFertilityManager.IS_MODIFYING_FERTILITY.get()) {
            return;
        }

        RootyBlock soil = (RootyBlock) (Object) this;
        BlockState state = level.getBlockState(pos);
        int oldFertility = soil.getFertility(state, level, pos);

        // Si la fertilité ne change pas réellement, pas besoin de déclencher l'événement
        if (oldFertility == newFertility) {
            return;
        }

        Species species = soil.getSpecies(state, level, pos);
        int amount = newFertility - oldFertility;

        DTFertilityChangeEvent event = new DTFertilityChangeEvent(
                level,
                pos,
                soil,
                species,
                oldFertility,
                amount
        );

        // Poste l'événement
        MinecraftForge.EVENT_BUS.post(event);

        // NOUVEAU : Si l'événement a été géré / annulé par notre mod,
        // on bloque la méthode d'origine pour qu'elle n'écrase pas notre valeur !
        if (event.isCanceled()) {
            ci.cancel();
        }
    }
}