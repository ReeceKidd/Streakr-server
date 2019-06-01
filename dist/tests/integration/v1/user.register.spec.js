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
const responseCodes_1 = require("../../../src/Server/responseCodes");
const userRegistationRoute = `/${versions_1.ApiVersions.v1}/${routeCategories_1.RouteCategories.users}`;
describe(userRegistationRoute, () => {
    const userName = "tester1";
    const email = "tester1@gmail.com";
    const password = "12345678";
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield User_1.userModel.deleteOne({ email });
    }));
    test('user can register successfully', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(9);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName,
            email,
            password
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.created);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('streaks');
        expect(response.body).toHaveProperty('role');
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('userName');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
    }));
    test('fails because nothing is sent with request', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute);
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"userName\" fails because [\"userName\" is required]');
    }));
    test('fails because userName is missing from request', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            email: "tester1@gmail.com",
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"userName\" fails because [\"userName\" is required]');
    }));
    test('fails because userName already exists', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester001@gmail.com",
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.badRequest);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`User with userName: 'tester1' already exists`);
    }));
    test('fails because userName must be a string', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: 1234567,
            email: "tester001@gmail.com",
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`child \"userName\" fails because [\"userName\" must be a string]`);
    }));
    test('fails because email is missing from request', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester1",
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"email\" fails because [\"email\" is required]');
    }));
    test('fails because email already exists', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester01",
            email: "tester1@gmail.com",
            password: "12345678"
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.badRequest);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`User with email: 'tester1@gmail.com' already exists`);
    }));
    test('fails because email is invalid', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester01",
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
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester1@gmail.com",
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" is required]');
    }));
    test('fails because password is less than 6 characters long', () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(4);
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester1",
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
        const response = yield request(app_1.default).post(userRegistationRoute).send({
            userName: "tester1",
            email: "tester1@gmail.com",
            password: 123456
        });
        expect(response.status).toEqual(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('child \"password\" fails because [\"password\" must be a string]');
    }));
});
//# sourceMappingURL=user.register.spec.js.map