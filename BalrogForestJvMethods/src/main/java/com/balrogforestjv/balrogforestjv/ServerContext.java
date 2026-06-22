package com.balrogforestjv.balrogforestjv;

import net.minecraft.server.level.ServerLevel;

public class ServerContext {
    // On stocke une référence statique vers le monde principal
    private static ServerLevel currentServerLevel;

    public static void setServerLevel(ServerLevel level) {
        currentServerLevel = level;
    }

    public static ServerLevel getServerLevel() {
        return currentServerLevel;
    }
}
