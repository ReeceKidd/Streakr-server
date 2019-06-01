"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
const logger = winston.createLogger({
    level: "debug",
    exitOnError: false,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: "error.log",
            level: "error",
            handleExceptions: true,
        }),
        new winston.transports.File({ filename: "combined.log" }),
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ],
});
exports.default = logger;
//# sourceMappingURL=Logger.js.map