"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const Logger_1 = require("./Logging/Logger");
const port = 4040;
app_1.default.listen(port, () => {
    Logger_1.default.info('Express server listening on port ' + port);
});
//# sourceMappingURL=server.js.map