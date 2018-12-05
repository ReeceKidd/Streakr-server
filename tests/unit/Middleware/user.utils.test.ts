import { UserUtils } from "../../../src/Middleware/user.utils";

const className = "UserUtils";
const classMethods = {
  createUserFromRequest: "createUserFromRequest"
};

describe(`${className}- ${classMethods.createUserFromRequest}`, () => {
  describe(`${classMethods.createUserFromRequest}`, () => {
    it("checks that valid user is created", () => {
      const userName = "test";
      const email = "test@gmail.com";
      const hashedPassword = "12345";

      const userModel = () => ({ userName, email, hashedPassword });
      const request: any = {
        body: { userName, email }
      };
      const response: any = {
        locals: {
          createUser: userModel,
          hashedPassword
        }
      };

      const middleware = UserUtils.createUserFromRequest;

      middleware(request, response, next => {
        const user = response.locals.user;
        expect.assertions(7);

        expect(request.body).toHaveProperty("userName");
        expect(request.body).toHaveProperty("email");

        expect(user).toHaveProperty("_id");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("password");
        expect(user).toHaveProperty("streaks");
        expect(user).toHaveProperty("userName");
      });
    });
  });
});
