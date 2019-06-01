"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getUsersMiddlewares_1 = require("../RouteMiddlewares/User/getUsersMiddlewares");
const verifyJsonWebTokenMiddlewares_1 = require("../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewares");
const addFriendMiddlewares_1 = require("../RouteMiddlewares/Friends/addFriendMiddlewares");
const getFriendsMiddlewares_1 = require("../RouteMiddlewares/Friends/getFriendsMiddlewares");
const registerUserMiddlewares_1 = require("../RouteMiddlewares/User/registerUserMiddlewares");
exports.userId = "userId";
var UserProperties;
(function (UserProperties) {
    UserProperties["friends"] = "friends";
})(UserProperties = exports.UserProperties || (exports.UserProperties = {}));
const usersRouter = express_1.Router();
usersRouter.get("/", ...verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares, ...getUsersMiddlewares_1.getUsersMiddlewares);
usersRouter.post(`/`, ...registerUserMiddlewares_1.registerUserMiddlewares);
usersRouter.get(`/:${exports.userId}/${UserProperties.friends}`, ...verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares, ...getFriendsMiddlewares_1.getFriendsMiddlewares);
usersRouter.put(`/:${exports.userId}/${UserProperties.friends}`, ...verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares, ...addFriendMiddlewares_1.addFriendMiddlewares);
exports.default = usersRouter;
//# sourceMappingURL=usersRouter.js.map