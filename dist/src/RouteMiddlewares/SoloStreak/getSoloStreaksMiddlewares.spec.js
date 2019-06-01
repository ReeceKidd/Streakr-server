"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSoloStreaksMiddlewares_1 = require("./getSoloStreaksMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
describe("getSoloStreaksValidationMiddleware", () => {
    test("check that valid request passes", () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { userId: "1234" }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getSoloStreaksMiddlewares_1.getSoloStreaksValidationMiddleware(request, response, next);
        expect(next).toBeCalledWith();
    });
    test("check that request with no params fails", () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: {}
        };
        const response = {
            status
        };
        const next = jest.fn();
        getSoloStreaksMiddlewares_1.getSoloStreaksValidationMiddleware(request, response, next);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that userId cannot be a number", () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { userId: 123 }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getSoloStreaksMiddlewares_1.getSoloStreaksValidationMiddleware(request, response, next);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });
});
describe("findSoloStreaksMiddleware", () => {
    test("check that soloStreaks are retreived correctly", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find
        };
        const request = { query: { userId: "1234" } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getSoloStreaksMiddlewares_1.getFindSoloStreaksMiddleware(soloStreakModel);
        yield middleware(request, response, next);
        expect(response.locals.soloStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    }));
    test("checks that next is called with error if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const ERROR_MESSAGE = "error";
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const soloStreakModel = {
            find
        };
        const request = { query: { userId: "1234" } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getSoloStreaksMiddlewares_1.getFindSoloStreaksMiddleware(soloStreakModel);
        yield middleware(request, response, next);
        expect(response.locals.friends).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe("sendSoloStreaksMiddleware", () => {
    test("should send soloStreaks in response", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const soloStreaks = [{
                name: "30 minutes reading",
                description: "Read for 30 minutes everyday",
                userId: "1234"
            }];
        const response = { locals: { soloStreaks }, status };
        const next = jest.fn();
        getSoloStreaksMiddlewares_1.sendSoloStreaksMiddleware(request, response, next);
        send;
        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.success);
        expect(send).toBeCalledWith({ soloStreaks });
    });
    test("should call next with an error on failure", () => {
        const ERROR_MESSAGE = "sendSoloStreaks error";
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response = { locals: {}, status };
        const request = {};
        const next = jest.fn();
        getSoloStreaksMiddlewares_1.sendSoloStreaksMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe(`getSoloStreaksMiddlewares`, () => {
    test("that getSoloStreaksMiddlewares are defined in the correct order", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        expect(getSoloStreaksMiddlewares_1.getSoloStreaksMiddlewares[0]).toBe(getSoloStreaksMiddlewares_1.getSoloStreaksValidationMiddleware);
        expect(getSoloStreaksMiddlewares_1.getSoloStreaksMiddlewares[1]).toBe(getSoloStreaksMiddlewares_1.findSoloStreaksMiddleware);
        expect(getSoloStreaksMiddlewares_1.getSoloStreaksMiddlewares[2]).toBe(getSoloStreaksMiddlewares_1.sendSoloStreaksMiddleware);
    }));
});
//# sourceMappingURL=getSoloStreaksMiddlewares.spec.js.map