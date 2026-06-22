package com.balrogforestjv.balrogforestjv;

import java.util.ArrayList;
import java.util.List;

public class TreeData {
    public String tree_species;
    public int x;
    public int z;
    public String rooty_block;

    public List<BranchInfo> branch = new ArrayList<>();

    public TreeData(String tree_species, int x, int z, String rooty_block) {
        this.tree_species = tree_species;
        this.x = x;
        this.z = z;
        this.rooty_block = rooty_block;
    }

    public static class BranchInfo {
        public int x, y, z;
        public int radius;
        public double volume;

        public BranchInfo(int x, int y, int z, int radius, double volume) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.radius = radius;
            this.volume = volume;
        }
    }
}