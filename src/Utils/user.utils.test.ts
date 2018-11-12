import { UserUtils } from "./user.utils";

describe("UserUtils - createUserFromRequest()", () => {
    it("checks that valid user is created", () => {
        expect.assertions(5)
        const validUserName = "test"
        const validEmail = "test@gmail.com"
        const validPassword = "password"
        const user = UserUtils.createUserFromRequest(validUserName, validEmail, validPassword)
        expect(user).toHaveProperty('_id')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('password')
        expect(user).toHaveProperty('streaks')
        expect(user).toHaveProperty('userName')
    });
  });
  