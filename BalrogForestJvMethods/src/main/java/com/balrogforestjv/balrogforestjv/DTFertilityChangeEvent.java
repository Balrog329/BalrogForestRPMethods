package com.balrogforestjv.balrogforestjv;

import com.ferreusveritas.dynamictrees.block.rooty.RootyBlock;
import com.ferreusveritas.dynamictrees.tree.species.Species;
import net.minecraft.core.BlockPos;
import net.minecraft.world.level.Level;
import net.minecraftforge.eventbus.api.Cancelable;
import net.minecraftforge.eventbus.api.Event;

@Cancelable
public class DTFertilityChangeEvent extends Event {

    private final Level level;
    private final BlockPos rootPos;
    private final RootyBlock soil;
    private final Species species;
    private final int oldFertility;
    private int amount;

    public DTFertilityChangeEvent(
            Level level,
            BlockPos rootPos,
            RootyBlock soil,
            Species species,
            int oldFertility,
            int amount
    ) {
        this.level = level;
        this.rootPos = rootPos;
        this.soil = soil;
        this.species = species;
        this.oldFertility = oldFertility;
        this.amount = amount;
    }

    public Level getLevel() { return level; }
    public BlockPos getRootPos() { return rootPos; }
    public RootyBlock getSoil() { return soil; }
    public Species getSpecies() { return species; }
    public int getOldFertility() { return oldFertility; }
    public int getAmount() { return amount; }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}