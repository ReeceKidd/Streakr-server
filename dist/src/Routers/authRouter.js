"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginMiddlewares_1 = require("../RouteMiddlewares/Auth/loginMiddlewares");
exports.AuthPaths = {
    login: "login",
    verifyJsonWebToken: "verify-json-web-token"
};
const authRouter = express_1.Router();
authRouter.post(`/${exports.AuthPaths.login}`, ...loginMiddlewares_1.loginMiddlewares);
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map