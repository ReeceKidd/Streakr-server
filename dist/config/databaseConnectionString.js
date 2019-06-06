"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const credentials_1 = require("./credentials");
const DATABASE_IDENTIFIERS_1 = require("./DATABASE_IDENTIFIERS");
const ENVIRONMENT_CONFIG_1 = require("./ENVIRONMENT_CONFIG");
let databaseConnectionString = `mongodb+srv://${credentials_1.databaseUsername}:${credentials_1.databasePassword}@cluster0-kxrys.mongodb.net/${DATABASE_IDENTIFIERS_1.DATABASE_IDENTIFIERS[process.env.NODE_ENV]}?retryWrites=true&w=majority`;
if (process.env.NODE_ENV === ENVIRONMENT_CONFIG_1.Environments.LOCAL) {
    databaseConnectionString = `mongodb://localhost:27017/local`;
}
exports.default = databaseConnectionString;
//# sourceMappingURL=databaseConnectionString.js.map