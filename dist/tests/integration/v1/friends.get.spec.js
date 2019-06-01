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
const userRegisteredEmail = "get-friends-user@gmail.com";
const userRegisteredPassword = "12345678";
const userRegisteredUserName = 'get-friends-user';
const friendRegisteredEmail = 'get-friends-friend@gmail.com';
const friendRegisteredPassword = '23456789';
const friendRegisteredUserName = 'get-friends-friend';
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
describe('getFriendsRoute', () => {
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
        const addFriendRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}/${userId}/${usersRouter_1.UserProperties.friends}`;
        yield request(app_1.default)
            .put(addFriendRoute)
            .send({
            friendId
        })
            .set({ 'x-access-token': jsonWebToken });
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: userRegisteredEmail });
        yield User_1.userModel.deleteOne({ email: friendRegisteredEmail });
    }));
    test(`that friends can be retreived for user`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const getFriendsRouteWithUserId = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}/${userId}/${usersRouter_1.UserProperties.friends}`;
        const getFriendsResponse = yield request(app_1.default)
            .get(getFriendsRouteWithUserId)
            .set({ 'x-access-token': jsonWebToken });
        expect(getFriendsResponse.status).toEqual(responseCodes_1.ResponseCodes.success);
        expect(getFriendsResponse.type).toEqual('application/json');
        expect(getFriendsResponse.body.friends.length).toEqual(1);
        expect(getFriendsResponse.body.friends[0].userName).toEqual(friendRegisteredUserName);
    }));
});
//# sourceMappingURL=friends.get.spec.js.map