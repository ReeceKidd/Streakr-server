"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const ENVIRONMENT_CONFIG_1 = require("../config/ENVIRONMENT_CONFIG");
const versions_1 = require("./Server/versions");
const v1_1 = __importDefault(require("./versions/v1"));
const databaseConnectionString_1 = __importDefault(require("../config/databaseConnectionString"));
const app = express_1.default();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get(`/health`, (request, response, next) => {
    return response.status(200).send({ message: "success" });
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = ENVIRONMENT_CONFIG_1.Environments.PROD;
}
mongoose_1.default
    .connect(databaseConnectionString_1.default, { useNewUrlParser: true, useFindAndModify: false })
    .catch(err => console.log(err.message));
mongoose_1.default.set("useCreateIndex", true);
app.use(`/${versions_1.ApiVersions.v1}`, v1_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map