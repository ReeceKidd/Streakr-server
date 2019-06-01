"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyJsonWebTokenMiddlewares_1 = require("../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares");
const getSoloStreaksMiddlewares_1 = require("../RouteMiddlewares/SoloStreak/getSoloStreaksMiddlewares");
const createSoloStreakMiddlewares_1 = require("../RouteMiddlewares/SoloStreak/createSoloStreakMiddlewares");
const createSoloStreakCompleteTaskMiddlewares_1 = require("../RouteMiddlewares/SoloStreak/createSoloStreakCompleteTaskMiddlewares");
const getSoloStreakMiddlewares_1 = require("../RouteMiddlewares/SoloStreak/getSoloStreakMiddlewares");
const patchSoloStreakMiddlewares_1 = require("../RouteMiddlewares/SoloStreak/patchSoloStreakMiddlewares");
const deleteSoloStreakMiddlewares_1 = require("../RouteMiddlewares/SoloStreak/deleteSoloStreakMiddlewares");
var SoloStreakProperties;
(function (SoloStreakProperties) {
    SoloStreakProperties["completeTasks"] = "complete-tasks";
})(SoloStreakProperties = exports.SoloStreakProperties || (exports.SoloStreakProperties = {}));
exports.soloStreakId = "soloStreakId";
const soloStreaksRouter = express_1.Router();
soloStreaksRouter.use("*", ...verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares);
soloStreaksRouter.get(`/`, ...getSoloStreaksMiddlewares_1.getSoloStreaksMiddlewares);
soloStreaksRouter.post(`/`, ...createSoloStreakMiddlewares_1.createSoloStreakMiddlewares);
soloStreaksRouter.get(`/:${exports.soloStreakId}`, ...getSoloStreakMiddlewares_1.getSoloStreakMiddlewares);
soloStreaksRouter.patch(`/:${exports.soloStreakId}`, ...patchSoloStreakMiddlewares_1.patchSoloStreakMiddlewares);
soloStreaksRouter.delete(`/:${exports.soloStreakId}`, ...deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddlewares);
soloStreaksRouter.post(`/:${exports.soloStreakId}/${SoloStreakProperties.completeTasks}`, ...createSoloStreakCompleteTaskMiddlewares_1.createSoloStreakCompleteTaskMiddlewares);
exports.default = soloStreaksRouter;
//# sourceMappingURL=soloStreaksRouter.js.map