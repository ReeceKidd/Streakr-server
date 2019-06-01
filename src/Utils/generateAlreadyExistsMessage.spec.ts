import { generateAlreadyExistsMessage } from "./generateAlreadyExistsMessage";

const mockEmail = "test@gmail.com";
const emailKey = "email";
const subject = "subject";

describe(`generateAlreadyExistsMessage`, () => {
    test("check that generateAlreadyExistsMessage returns string as expected", () => {
        expect.assertions(1);
        const result = generateAlreadyExistsMessage(subject, emailKey, mockEmail);
        expect(result).toEqual(`${subject} with ${emailKey}: '${mockEmail}' already exists`);
    });
});
