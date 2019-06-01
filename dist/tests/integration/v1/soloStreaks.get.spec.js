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
const AgendaJob_1 = require("../../../src/Models/AgendaJob");
const SoloStreak_1 = require("../../../src/Models/SoloStreak");
const authRouter_1 = require("../../../src/Routers/authRouter");
const responseCodes_1 = require("../../../src/Server/responseCodes");
const headers_1 = require("../../../src/Server/headers");
const registeredEmail = "get-solo-streaks@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = 'get-solo-streaks-user';
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
const createSoloStreakRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}`;
const getSoloStreaksRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}`;
const soloStreakName = "Daily Spanish";
const soloStreakDescription = "Each day I must do the insame amount 50xp of Duolingo";
const parisTimezone = "Europe/Paris";
describe(getSoloStreaksRoute, () => {
    let jsonWebToken;
    let userId;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        const registrationResponse = yield request(app_1.default)
            .post(registrationRoute)
            .send({
            userName: registeredUserName,
            email: registeredEmail,
            password: registeredPassword
        });
        userId = registrationResponse.body._id;
        const loginResponse = yield request(app_1.default)
            .post(loginRoute)
            .send({
            email: registeredEmail,
            password: registeredPassword
        });
        jsonWebToken = loginResponse.body.jsonWebToken;
        yield request(app_1.default)
            .post(createSoloStreakRoute)
            .send({
            userId,
            name: soloStreakName,
            description: soloStreakDescription,
        })
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [headers_1.SupportedRequestHeaders.xTimezone]: parisTimezone });
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
        yield SoloStreak_1.soloStreakModel.deleteOne({ name: soloStreakName });
        yield AgendaJob_1.agendaJobModel.deleteOne({ "data.timezone": parisTimezone });
    }));
    test(`that solo streaks can be retreived for user`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(10);
        const getSoloStreaksRouteWithQueryParamater = `${getSoloStreaksRoute}?userId=${userId}`;
        const response = yield request(app_1.default)
            .get(getSoloStreaksRouteWithQueryParamater)
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.success);
        expect(response.type).toEqual('application/json');
        expect(response.body.soloStreaks.length).toEqual(1);
        expect(response.body.soloStreaks[0].name).toEqual(soloStreakName);
        expect(response.body.soloStreaks[0].description).toEqual(soloStreakDescription);
        expect(response.body.soloStreaks[0].userId).toEqual(userId);
        expect(response.body.soloStreaks[0]).toHaveProperty('_id');
        expect(response.body.soloStreaks[0]).toHaveProperty('startDate');
        expect(response.body.soloStreaks[0]).toHaveProperty('createdAt');
        expect(response.body.soloStreaks[0]).toHaveProperty('updatedAt');
    }));
});
jest.setTimeout(30000);
//# sourceMappingURL=soloStreaks.get.spec.js.map