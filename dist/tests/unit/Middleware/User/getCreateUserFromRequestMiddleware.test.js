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
const getCreateUserFromRequestMiddleware_1 = require("../../../../src/Middleware/User/getCreateUserFromRequestMiddleware");
const middlewareName = "getCreateUserFromRequestMiddleware";
const ERROR_MESSAGE = "error";
describe(`${middlewareName}`, () => {
    it("should define response.locals.newUser", () => __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = "12$4354";
        const userName = 'user';
        const email = 'user@gmail.com';
        class User {
            constructor({ userName, email, password }) {
                this.userName = userName;
                this.email = email;
                this.password = password;
            }
        }
        const response = { locals: { hashedPassword } };
        const request = { body: { userName, email } };
        const next = jest.fn();
        const middleware = getCreateUserFromRequestMiddleware_1.getCreateUserFromRequestMiddleware(User);
        yield middleware(request, response, next);
        expect.assertions(1);
        const newUser = new User({ userName, email, password: hashedPassword });
        expect(response.locals.newUser).toEqual(newUser);
    }));
});
//# sourceMappingURL=getCreateUserFromRequestMiddleware.test.js.map