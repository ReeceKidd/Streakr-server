"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessage_helper_1 = require("../../../src/Utils/errorMessage.helper");
const className = "ErrorMessageHelper";
const classMethods = {
    generateAlreadyExistsMessage: "generateAlreadyExistsMessage"
};
describe(`${className}`, () => {
    describe(`${classMethods.generateAlreadyExistsMessage}`, () => {
        it("should return correct error message", () => {
            expect.assertions(1);
            const userNameKey = "userName";
            const userName = "tester";
            const errorMessage = errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage(userNameKey, userName);
            expect.assertions(1);
            expect(errorMessage).toBe(`User with ${userNameKey}: '${userName}' already exists`);
        });
    });
});
//# sourceMappingURL=errorMessager.helper.test.js.map