"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
class LoggerStream {
    write(text) {
        console.log(text);
        Logger_1.default.info(text);
    }
}
exports.default = new LoggerStream();
//# sourceMappingURL=LoggerStream.js.map