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
const successMessages_1 = require("../../../src/Messages/successMessages");
const failureMessages_1 = require("../../../src/Messages/failureMessages");
const getLocalisedString_1 = require("../../../src/Messages/getLocalisedString");
const messageCategories_1 = require("../../../src/Messages/messageCategories");
const authRouter_1 = require("../../../src/Routers/authRouter");
const responseCodes_1 = require("../../../src/Server/responseCodes");
const loginRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.auth}/${authRouter_1.AuthPaths.login}`;
const registrationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
const registeredEmail = "register@gmail.com";
const registeredUserName = 'registeredUser';
const registeredPassword = "12345678";
describe(loginRoute, () => {
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield request(app_1.default).post(registrationRoute).send({
            userName: registeredUserName,
            email: registeredEmail,
            password: registeredPassword
        });
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email: registeredEmail });
    }));
    test('user can login successfully and receives jsonWebToken in response', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(8);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: registeredEmail,
            password: registeredPassword
        });
        const localisedLoginSuccessMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.successMessages, successMessages_1.SuccessMessageKeys.loginSuccessMessage);
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.success);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('jsonWebToken');
        expect(response.body.jsonWebToken.length).toBeGreaterThan(20);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(localisedLoginSuccessMessage);
        expect(response.body.expiry.expiresIn).toBeDefined();
        expect(response.body.expiry.unitOfTime).toEqual('seconds');
    }));
    test('that response is correct when incorrect email and password is used', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(6);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: 'invalidemail@gmail.com',
            password: 'invalidPassword'
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.badRequest);
        expect(response.type).toEqual('application/json');
        expect(response.body).not.toHaveProperty('jsonWebToken');
        expect(response.body).toHaveProperty('message');
        const localisedFailureMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.loginUnsuccessfulMessage);
        expect(response.body.message).toEqual(localisedFailureMessage);
        expect(response.body.expiry).not.toBeDefined();
    }));
    test('that response is correct when invalid email and correct password is used', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(6);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: 'invalidemail@gmail.com',
            password: registeredPassword
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.badRequest);
        expect(response.type).toEqual('application/json');
        expect(response.body).not.toHaveProperty('jsonWebToken');
        expect(response.body).toHaveProperty('message');
        const localisedFailureMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.loginUnsuccessfulMessage);
        expect(response.body.message).toEqual(localisedFailureMessage);
        expect(response.body.expiry).not.toBeDefined();
    }));
    test('that response is correct when valid email and incorrect password is used', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(6);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: registeredEmail,
            password: 'invalidPassword'
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.badRequest);
        expect(response.type).toEqual('application/json');
        expect(response.body).not.toHaveProperty('jsonWebToken');
        expect(response.body).toHaveProperty('message');
        const localisedFailureMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.loginUnsuccessfulMessage);
        expect(response.body.message).toEqual(localisedFailureMessage);
        expect(response.body.expiry).not.toBeDefined();
    }));
    test('fails because nothing is sent with request', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(loginRoute);
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"email\" fails because [\"email\" is required]');
    }));
    test('fails because email is missing from request', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(loginRoute).send({
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"email\" fails because [\"email\" is required]');
    }));
    test('fails because email is invalid', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: "invalid email",
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`child \"email\" fails because [\"email\" must be a valid email]`);
    }));
    test('fails because password is missing from request', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: "tester1@gmail.com",
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" is required]');
    }));
    test('fails because password is less than 6 characters long', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: "tester1@gmail.com",
            password: "1234"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" length must be at least 6 characters long]');
    }));
    test('fails because password is not a string', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(loginRoute).send({
            email: "tester1@gmail.com",
            password: 123456
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" must be a string]');
    }));
});
//# sourceMappingURL=auth.login.spec.js.map