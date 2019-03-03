import { loginMiddlewares } from './loginMiddlewares'
import { loginRequestValidationMiddleware } from '../../Middleware/Validation/Auth/loginRequestValidationMiddleware';
import { retreiveUserWithEmailMiddleware } from '../../Middleware/Database/retreiveUserWithEmailMiddleware';
import { userExistsValidationMiddleware } from '../../Middleware/Validation/User/userExistsValidationMiddleware';
import { compareRequestPasswordToUserHashedPasswordMiddleware } from '../../Middleware/Password/compareRequestPasswordToUserHashedPasswordMiddleware';
import { passwordsMatchValidationMiddleware } from '../../Middleware/Validation/User/passwordsMatchValidationMiddleware';
import { setMinimumUserDataMiddleware } from '../../Middleware/User/setMinimumUserDataMiddleware';
import { setJsonWebTokenMiddleware } from '../../Middleware/Auth/signJsonWebTokenMiddleware';
import { loginSuccessfulMiddleware } from '../../Middleware/Handlers/loginSuccessfulMiddleware';

describe(`loginMiddlewares`, () => {
  test("that login middlewares are defined in the correct order", async () => {
    expect.assertions(1);
    expect(loginMiddlewares).toEqual([
      loginRequestValidationMiddleware,
      retreiveUserWithEmailMiddleware,
      userExistsValidationMiddleware,
      compareRequestPasswordToUserHashedPasswordMiddleware,
      passwordsMatchValidationMiddleware,
      setMinimumUserDataMiddleware,
      setJsonWebTokenMiddleware,
      loginSuccessfulMiddleware
    ])
  });

});
