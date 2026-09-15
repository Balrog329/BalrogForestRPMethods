package com.balrogforestjv.balrogforestjv.utils;

import com.mojang.logging.LogUtils;
import org.slf4j.Logger;

public class ModLogger {

    private static final Logger LOGGER = LogUtils.getLogger();
    private static final String PREFIX = "[BalrogForest] ";

    public static void info(String message, Object... args) {
        LOGGER.info(PREFIX + message, args);
    }

    public static void warn(String message, Object... args) {
        LOGGER.warn(PREFIX + message, args);
    }

    public static void error(String message, Object... args) {
        LOGGER.error(PREFIX + message, args);
    }

    public static void debug(String message, Object... args) {
        LOGGER.debug(PREFIX + message, args);
    }
}