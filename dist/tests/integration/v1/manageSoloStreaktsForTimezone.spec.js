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
const SoloStreak_1 = require("../../../src/Models/SoloStreak");
const AgendaJob_1 = require("../../../src/Models/AgendaJob");
const authRouter_1 = require("../../../src/Routers/authRouter");
const headers_1 = require("../../../src/Server/headers");
const manageSoloStreaksForTimezone_1 = require("../../../src/Agenda/manageSoloStreaksForTimezone");
const registeredEmail = "manage-solo-streak-user@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = 'manage-solo-streak-user';
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
const soloStreakRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}`;
const bucharestTimezone = "Europe/Bucharest";
describe(`AGENDA manageSoloStreaksForTimezone`, () => {
    let jsonWebToken;
    let userId;
    let soloStreakId;
    let updatedName;
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
        const createSoloStreakResponse = yield request(app_1.default)
            .post(soloStreakRoute)
            .send({
            userId,
            name,
            description
        })
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [headers_1.SupportedRequestHeaders.xTimezone]: bucharestTimezone });
        soloStreakId = createSoloStreakResponse.body._id;
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
        yield SoloStreak_1.soloStreakModel.deleteOne({ name: updatedName });
        yield AgendaJob_1.agendaJobModel.deleteOne({ "data.timezone": bucharestTimezone });
    }));
    test('test that soloStreak currentStreak gets pushed to pastStreaks and is then set to the default value', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const defaultCurrentStreak = {
            startDate: null,
            numberOfDaysInARow: 0
        };
        const endDate = new Date();
        yield manageSoloStreaksForTimezone_1.manageSoloStreaksForTimezone(bucharestTimezone, SoloStreak_1.soloStreakModel, defaultCurrentStreak, endDate);
        const updatedSoloStreak = yield SoloStreak_1.soloStreakModel.findById(soloStreakId).lean();
        expect(updatedSoloStreak.currentStreak).toEqual(defaultCurrentStreak);
        expect(updatedSoloStreak.pastStreaks).toEqual([Object.assign({}, defaultCurrentStreak, { endDate })]);
    }));
});
jest.setTimeout(30000);
//# sourceMappingURL=manageSoloStreaktsForTimezone.spec.js.map