"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyJsonWebTokenMiddlewaresWithResponse_1 = require("../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewaresWithResponse");
exports.TestPaths = {
    verifyJsonWebToken: "verify-json-web-token"
};
const testRouter = express_1.Router();
testRouter.post(`/${exports.TestPaths.verifyJsonWebToken}`, ...verifyJsonWebTokenMiddlewaresWithResponse_1.verifyJsonWebTokenMiddlewaresWithResponse);
exports.default = testRouter;
//# sourceMappingURL=testRouter.js.map