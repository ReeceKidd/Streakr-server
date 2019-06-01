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
const CompleteTask_1 = require("../../../src/Models/CompleteTask");
const authRouter_1 = require("../../../src/Routers/authRouter");
const headers_1 = require("../../../src/Server/headers");
const responseCodes_1 = require("../../../src/Server/responseCodes");
const registeredEmail = "create-complete-tasks-user@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = 'create-complete-tasks-user';
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
const createSoloStreakRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}`;
const londonTimezone = "Europe/London";
describe(createSoloStreakRoute, () => {
    let jsonWebToken;
    let userId;
    let soloStreakId;
    let secondSoloStreakId;
    const name = "Intermittent Fastings";
    const description = "I will not eat until 1pm everyday";
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
            .post(createSoloStreakRoute)
            .send({
            userId,
            name,
            description
        })
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
            .set({ [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone });
        soloStreakId = createSoloStreakResponse.body._id;
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
        yield SoloStreak_1.soloStreakModel.deleteOne({ _id: soloStreakId });
        yield SoloStreak_1.soloStreakModel.deleteOne({ _id: secondSoloStreakId });
        yield AgendaJob_1.agendaJobModel.deleteOne({ "data.timezone": londonTimezone });
        yield AgendaJob_1.agendaJobModel.deleteOne({ "data.timezone": londonTimezone });
        yield CompleteTask_1.completeTaskModel.deleteOne({ userId, streakId: soloStreakId });
        yield CompleteTask_1.completeTaskModel.deleteOne({ userId, streakId: secondSoloStreakId });
    }));
    describe('/v1/solo-streaks/{id}/complete-tasks', () => {
        test('that user can say that a task has been completed for the day', () => __awaiter(this, void 0, void 0, function* () {
            expect.assertions(5);
            const completeTaskResponse = yield request(app_1.default)
                .post(`/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}/${soloStreakId}/${routeCategories_1.RouteCategories.completeTasks}`)
                .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone });
            expect(completeTaskResponse.status).toEqual(responseCodes_1.ResponseCodes.created);
            expect(completeTaskResponse.body.completeTask._id).toBeDefined();
            expect(completeTaskResponse.body.completeTask.taskCompleteTime).toBeDefined();
            expect(completeTaskResponse.body.completeTask.userId).toEqual(userId);
            expect(completeTaskResponse.body.completeTask.streakId).toEqual(soloStreakId);
        }));
        test('that user cannot complete the same task in the same day', () => __awaiter(this, void 0, void 0, function* () {
            expect.assertions(2);
            const secondaryCreateSoloStreakResponse = yield request(app_1.default)
                .post(createSoloStreakRoute)
                .send({
                userId,
                name,
                description
            })
                .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone });
            secondSoloStreakId = secondaryCreateSoloStreakResponse.body._id;
            yield request(app_1.default)
                .post(`/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}/${secondSoloStreakId}/${routeCategories_1.RouteCategories.completeTasks}`)
                .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone });
            const secondCompleteTaskResponse = yield request(app_1.default)
                .post(`/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.soloStreaks}/${secondSoloStreakId}/${routeCategories_1.RouteCategories.completeTasks}`)
                .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken })
                .set({ [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone });
            expect(secondCompleteTaskResponse.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
            expect(secondCompleteTaskResponse.body.message).toEqual('Task has already been completed today');
        }));
    });
});
jest.setTimeout(30000);
//# sourceMappingURL=completeTasks.spec.js.map