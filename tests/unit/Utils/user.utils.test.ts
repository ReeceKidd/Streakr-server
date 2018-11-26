import { UserUtils } from "../../../src/Utils/user.utils";

describe("UserUtils - createUserFromRequest()", () => {
    it("checks that valid user is created", () => {
        const validUserName = "test"
        const validEmail = "test@gmail.com"
        const validPassword = "password"
        const user = UserUtils.createUserFromRequest(validUserName, validEmail, validPassword)
        expect.assertions(5)
        expect(user).toHaveProperty('_id')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('streaks')
        expect(user).toHaveProperty('userName')
    });

  });
  