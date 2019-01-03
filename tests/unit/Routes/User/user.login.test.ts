import { userLoginMiddlewares } from "../../../../src/Routes/User/user.login";
import { userLoginValidationMiddleware } from "../../../../src/Middleware/Validation/userLoginValidationMiddleware";
import { retreiveUserWithEmailMiddleware } from "../../../../src/Middleware/Database/retreiveUserWithEmailMiddleware";
import { compareRequestPasswordToUserHashedPasswordMiddleware } from "../../../../src/Middleware/Password/compareRequestPasswordToUserHashedPasswordMiddleware";
import { passwordsMatchValidationMiddleware } from "../../../../src/Middleware/Validation/passwordsMatchValidationMiddleware";
import { loginSuccessfulMiddleware } from "../../../../src/Middleware/Auth/loginSuccessfulMiddleware";
import { setMinimumUserDataMiddleware } from "../../../../src/Middleware/User/setMinimumUserDataMiddleware";
import { setJsonWebTokenMiddleware } from "../../../../src/Middleware/Auth/setJsonWebtTokenMiddleware";
import { verifyJsonWebTokenMiddleware } from "../../../../src/Middleware/Auth/verifyJsonWebTokenMiddleware"

const fileName = "user.login";

describe(`${fileName}`, () => {
  it("check that exported array contains the necessary middlewares in the correct order", () => {
    expect.assertions(1);
    expect(userLoginMiddlewares).toEqual([
        userLoginValidationMiddleware,
        retreiveUserWithEmailMiddleware,
        compareRequestPasswordToUserHashedPasswordMiddleware,
        passwordsMatchValidationMiddleware,
        setMinimumUserDataMiddleware,
        setJsonWebTokenMiddleware,
        loginSuccessfulMiddleware
    ]);
  });
});
