"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("../Routers/authRouter"));
const soloStreaksRouter_1 = __importDefault(require("../Routers/soloStreaksRouter"));
const testRouter_1 = __importDefault(require("../Routers/testRouter"));
const usersRouter_1 = __importDefault(require("../Routers/usersRouter"));
const routeCategories_1 = require("../routeCategories");
const v1Router = express_1.Router();
v1Router.use(`/${routeCategories_1.RouteCategories.soloStreaks}`, soloStreaksRouter_1.default);
v1Router.use(`/${routeCategories_1.RouteCategories.users}`, usersRouter_1.default);
v1Router.use(`/${routeCategories_1.RouteCategories.auth}`, authRouter_1.default);
v1Router.use(`/${routeCategories_1.RouteCategories.test}`, testRouter_1.default);
exports.default = v1Router;
//# sourceMappingURL=v1.js.map