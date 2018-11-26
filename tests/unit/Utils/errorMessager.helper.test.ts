import {ErrorMessageHelper} from "../../../src/Utils/errorMessage.helper";

describe("ErrorMessageHelper - generateAlreadyExistsMessage", () => {
    it("should return correct error message", async() => {
        expect.assertions(1)
        const userNameKey = "userName"
        const userName = "tester"
        const errorMessage = ErrorMessageHelper.generateAlreadyExistsMessage(userNameKey, userName)
        expect.assertions(1)
        expect(errorMessage).toBe(`User with ${userNameKey}: '${userName}' already exists`)
    });
  });
  