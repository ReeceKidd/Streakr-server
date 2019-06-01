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
const testRouter_1 = require("../../../src/Routers/testRouter");
const responseCodes_1 = require("../../../src/Server/responseCodes");
const headers_1 = require("../../../src/Server/headers");
const registeredEmail = "jsonwebtoken@gmail.com";
const registeredPassword = "12345678";
const registeredUserName = "json-web-token-user";
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
const verifyJsonWebTokenRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.test}/${testRouter_1.TestPaths.verifyJsonWebToken}`;
describe(verifyJsonWebTokenRoute, () => {
    let jsonWebToken;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield request(app_1.default).post(registrationRoute).send({
            userName: registeredUserName,
            email: registeredEmail,
            password: registeredPassword
        });
        const loginResponse = yield request(app_1.default).post(loginRoute).send({
            email: registeredEmail,
            password: registeredPassword
        });
        jsonWebToken = loginResponse.body.jsonWebToken;
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
    }));
    test(`that request passes when json web token is valid`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const response = yield request(app_1.default)
            .post(verifyJsonWebTokenRoute)
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.success);
        expect(response.body.auth).toBe(true);
        expect(response.type).toEqual('application/json');
    }));
    test('that request fails when json web token is invalid', () => __awaiter(this, void 0, void 0, function* () {
        const invalidJsonWebToken = 'OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw';
        expect.assertions(3);
        const response = yield request(app_1.default)
            .post(verifyJsonWebTokenRoute)
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: invalidJsonWebToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unautohorized);
        expect(response.body.auth).toBe(false);
        expect(response.type).toEqual('application/json');
    }));
    test(`that request fails when json web token is out of date.`, () => __awaiter(this, void 0, void 0, function* () {
        const outOfDateToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaW5pbXVtVXNlckRhdGEiOnsiX2lkIjoiNWMzNTExNjA1OWY3YmExOWU0ZTI0OGE5IiwidXNlck5hbWUiOiJ0ZXN0ZXIifSwiaWF0IjoxNTQ3MDE0NTM5LCJleHAiOjE1NDc2MTkzMzl9.tGUQo9W8SOgktnaVvGQn6i33wUmUQPbnUDDTllIzPLw';
        expect.assertions(3);
        const response = yield request(app_1.default)
            .post(verifyJsonWebTokenRoute)
            .set({ [headers_1.SupportedRequestHeaders.xAccessToken]: outOfDateToken });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unautohorized);
        expect(response.body.auth).toBe(false);
        expect(response.type).toEqual('application/json');
    }));
    test(`that request fails when json web token is missing from header`, () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(verifyJsonWebTokenRoute);
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unautohorized);
        expect(response.body.auth).toBe(false);
        expect(response.body.message).toBe('JSON web token is missing from header');
        expect(response.type).toEqual('application/json');
    }));
});
//# sourceMappingURL=verifyJsonWebToken.spec.js.map