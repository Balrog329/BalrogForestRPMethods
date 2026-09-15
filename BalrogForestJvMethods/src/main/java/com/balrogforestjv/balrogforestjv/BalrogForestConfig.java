package com.balrogforestjv.balrogforestjv;

public class BalrogForestConfig {

    // Processus activé par défaut
    private static boolean fertilityProcessEnabled = true;

    public static boolean isFertilityProcessEnabled() {
        return fertilityProcessEnabled;
    }

    public static void setFertilityProcessEnabled(boolean enabled) {
        fertilityProcessEnabled = enabled;
    }
}