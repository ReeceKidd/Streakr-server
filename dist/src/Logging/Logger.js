"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const express = require("express");
const ENVIRONMENT_CONFIG_1 = require("../../config/ENVIRONMENT_CONFIG");
const logger = winston.createLogger({
    level: "debug",
    exitOnError: false,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: "error.log",
            level: "error",
            handleExceptions: true
        }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});
if (express().settings.env !== ENVIRONMENT_CONFIG_1.default.PROD) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
exports.default = logger;
//# sourceMappingURL=Logger.js.map