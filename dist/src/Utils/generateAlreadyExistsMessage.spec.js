"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateAlreadyExistsMessage_1 = require("./generateAlreadyExistsMessage");
const mockEmail = "test@gmail.com";
const emailKey = "email";
const subject = "subject";
describe(`generateAlreadyExistsMessage`, () => {
    test("check that generateAlreadyExistsMessage returns string as expected", () => {
        expect.assertions(1);
        const result = generateAlreadyExistsMessage_1.generateAlreadyExistsMessage(subject, emailKey, mockEmail);
        expect(result).toEqual(`${subject} with ${emailKey}: '${mockEmail}' already exists`);
    });
});
//# sourceMappingURL=generateAlreadyExistsMessage.spec.js.map