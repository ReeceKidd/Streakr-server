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
const responseCodes_1 = require("../../../src/Server/responseCodes");
const registeredEmail = "search-user@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = 'search-user';
const searchableUserEmail = "other-user@gmail.com";
const searchableUserPassword = "12345678";
const searchableUserUserName = 'other-user';
const searchQueryKey = "searchQuery";
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
describe('/users', () => {
    let jsonWebToken;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield request(app_1.default)
            .post(registrationRoute)
            .send({
            userName: registeredUserName,
            email: registeredEmail,
            password: registeredPassword
        });
        const loginResponse = yield request(app_1.default)
            .post(loginRoute)
            .send({
            email: registeredEmail,
            password: registeredPassword
        });
        jsonWebToken = loginResponse.body.jsonWebToken;
        yield request(app_1.default)
            .post(registrationRoute)
            .send({
            userName: searchableUserUserName,
            email: searchableUserEmail,
            password: searchableUserPassword
        });
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
        yield User_1.userModel.deleteOne({ email: searchableUserEmail });
    }));
    test(`that request returns searchAbleUser when full searchTerm is uaed`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(10);
        const getUsersByRegexSearchRouteWithSearchQueryRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}?${searchQueryKey}=${searchableUserUserName}`;
        const response = yield request(app_1.default)
            .get(getUsersByRegexSearchRouteWithSearchQueryRoute)
            .set({ 'x-access-token': jsonWebToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.success);
        expect(response.type).toEqual('application/json');
        const users = response.body.users;
        expect(users.length).toBe(1);
        expect(users[0]).toHaveProperty('streaks');
        expect(users[0]).toHaveProperty('role');
        expect(users[0]).toHaveProperty('_id');
        expect(users[0]).toHaveProperty('userName');
        expect(users[0]).toHaveProperty('email');
        expect(users[0]).toHaveProperty('createdAt');
        expect(users[0]).toHaveProperty('updatedAt');
    }));
    test('that request returns searchAble user when partial searchTerm is used', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(10);
        const partialSearchQuery = `${searchableUserUserName[0]}${searchableUserUserName[1]}${searchableUserUserName[2]}`;
        const getUsersByRegexSearchWithPartialSearchQueryRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}?${searchQueryKey}=${partialSearchQuery}`;
        const response = yield request(app_1.default)
            .get(getUsersByRegexSearchWithPartialSearchQueryRoute)
            .set({ 'x-access-token': jsonWebToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.success);
        expect(response.type).toEqual('application/json');
        const users = response.body.users;
        expect(users.length).toBe(1);
        expect(users[0]).toHaveProperty('streaks');
        expect(users[0]).toHaveProperty('role');
        expect(users[0]).toHaveProperty('_id');
        expect(users[0]).toHaveProperty('userName');
        expect(users[0]).toHaveProperty('email');
        expect(users[0]).toHaveProperty('createdAt');
        expect(users[0]).toHaveProperty('updatedAt');
    }));
});
jest.setTimeout(30000);
//# sourceMappingURL=users.get.spec.js.map