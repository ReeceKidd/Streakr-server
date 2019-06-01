"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const Logger_1 = __importDefault(require("./Logging/Logger"));
const port = 4040;
app_1.default.listen(port, () => {
    Logger_1.default.info("Express server listening on port " + port);
});
//# sourceMappingURL=server.js.map