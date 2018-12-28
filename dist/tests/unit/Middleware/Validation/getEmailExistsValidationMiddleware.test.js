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
const getEmailExistsValidationMiddleware_1 = require("../../../../src/Middleware/Validation/getEmailExistsValidationMiddleware");
const middlewareName = " getEmailExistsValidationMiddleware ";
const mockEmail = "test@gmail.com";
const emailKey = 'email';
describe(`${middlewareName}`, () => {
    it("check that error response is returned correctly when email already exists", () => __awaiter(this, void 0, void 0, function* () {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response = {
            locals: { emailExists: true },
            status
        };
        const next = jest.fn();
        const middleware = getEmailExistsValidationMiddleware_1.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, emailKey);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalled();
        expect(generateAlreadyExistsMessage).toBeCalledWith(emailKey, mockEmail);
    }));
    it("check that next is called when email doesn't exist", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response = {
            locals: { emailExists: false },
            status
        };
        const next = jest.fn();
        const middleware = getEmailExistsValidationMiddleware_1.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, emailKey);
        middleware(request, response, next);
        expect.assertions(4);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(generateAlreadyExistsMessage).not.toBeCalled();
        expect(next).toBeCalled();
    });
    it("check that when error is thrown next is called with err", () => {
        const errorMessage = 'error';
        const send = jest.fn(() => { throw new Error(errorMessage); });
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response = {
            locals: { emailExists: true },
            status
        };
        const next = jest.fn();
        const middleware = getEmailExistsValidationMiddleware_1.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, emailKey);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});
//# sourceMappingURL=getEmailExistsValidationMiddleware.test.js.map