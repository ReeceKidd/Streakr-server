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
const moment = __importStar(require("moment-timezone"));
const app_1 = __importDefault(require("../../../src/app"));
const versions_1 = require("../../../src/Server/versions");
const routeCategories_1 = require("../../../src/routeCategories");
const User_1 = require("../../../src/Models/User");
const SoloStreak_1 = require("../../../src/Models/SoloStreak");
const AgendaJob_1 = require("../../../src/Models/AgendaJob");
const authRouter_1 = require("../../../src/Routers/authRouter");
const responseCodes_1 = require("../../../src/Server/responseCodes");
const headers_1 = require("../../../src/Server/headers");
const registeredEmail = "create-solo-streak-user@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = 'create-solo-streak-user';
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
const createSoloStreakRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}`;
const londonTimezone = "Europe/London";
describe(createSoloStreakRoute, () => {
    let jsonWebToken;
    let userId;
    const name = "Keto";
    const description = "I will follow the keto diet every day";
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
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
        yield SoloStreak_1.soloStreakModel.deleteOne({ name });
        yield AgendaJob_1.agendaJobModel.deleteOne({ "data.timezone": londonTimezone });
    }));
    test(`that request passes when correct solo streak information is passed`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(12);
        const response = yield request(app_1.default)
            .post(createSoloStreakRoute)
            .send({
            userId,
            name,
            description
        })
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.created);
        expect(response.type).toEqual('application/json');
        expect(response.body.name).toEqual(name);
        expect(response.body.description).toEqual(description);
        expect(response.body.userId).toEqual(userId);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.currentStreak).toHaveProperty('startDate');
        expect(response.body.currentStreak).toHaveProperty('numberOfDaysInARow');
        expect(response.body).toHaveProperty('startDate');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
        const endOfDay = moment().tz(londonTimezone).endOf('day').toDate();
        const agendaJob = yield AgendaJob_1.agendaJobModel.findOne({ "data.timezone": londonTimezone });
        expect(agendaJob.nextRunAt).toEqual(endOfDay);
    }));
});
jest.setTimeout(30000);
//# sourceMappingURL=soloStreaks.create.spec.js.map