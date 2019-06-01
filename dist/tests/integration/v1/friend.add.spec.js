"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("supertest"));
const app_1 = __importDefault(require("../../../src/app"));
const versions_1 = require("../../../src/Server/versions");
const routeCategories_1 = require("../../../src/routeCategories");
const User_1 = require("../../../src/Models/User");
const authRouter_1 = require("../../../src/Routers/authRouter");
const usersRouter_1 = require("../../../src/Routers/usersRouter");
const responseCodes_1 = require("../../../src/Server/responseCodes");
const userRegisteredEmail = "add-friend-user@gmail.com";
const userRegisteredPassword = "1234567a";
const userRegisteredUserName = 'add-friend-user';
const friendRegisteredEmail = 'add-friend-friend@gmail.com';
const friendRegisteredPassword = '2345678b';
const friendRegisteredUserName = 'add-friend-friend';
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
describe('/v1/users/:userId/friends', () => {
    let jsonWebToken;
    let userId;
    let friendId;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        const userRegistrationResponse = yield request(app_1.default)
            .post(registrationRoute)
            .send({
            userName: userRegisteredUserName,
            email: userRegisteredEmail,
            password: userRegisteredPassword
        });
        userId = userRegistrationResponse.body._id;
        const loginResponse = yield request(app_1.default)
            .post(loginRoute)
            .send({
            email: userRegisteredEmail,
            password: userRegisteredPassword
        });
        jsonWebToken = loginResponse.body.jsonWebToken;
        const friendRegistrationResponse = yield request(app_1.default)
            .post(registrationRoute)
            .send({
            userName: friendRegisteredUserName,
            email: friendRegisteredEmail,
            password: friendRegisteredPassword
        });
        friendId = friendRegistrationResponse.body._id;
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: userRegisteredEmail });
        yield User_1.userModel.deleteOne({ email: friendRegisteredEmail });
    }));
    test(`that user can add a friend`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const addFriendRouteWithUserId = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}/${userId}/${usersRouter_1.UserProperties.friends}`;
        const response = yield request(app_1.default)
            .put(addFriendRouteWithUserId)
            .send({
            friendId
        })
            .set({ 'x-access-token': jsonWebToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.created);
        expect(response.type).toEqual('application/json');
        expect(response.body.message).toBeDefined();
        expect(response.body.friends).toBeDefined();
    }));
});
//# sourceMappingURL=friend.add.spec.js.map