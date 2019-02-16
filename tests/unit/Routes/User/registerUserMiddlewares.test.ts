import { registerUserMiddlewares } from '../../../../src/Routes/User/registerUserMiddlewares'
import { userRegistrationValidationMiddleware } from '../../../../src/Middleware/Validation/User/userRegistrationValidationMiddleware';
import { doesUserEmailExistMiddleware } from '../../../../src/Middleware/Database/doesUserEmailExistMiddleware';
import { emailExistsValidationMiddleware } from '../../../../src/Middleware/Validation/User/emailExistsValidationMiddleware';
import { doesUserNameExistMiddleware } from '../../../../src/Middleware/Database/doesUserNameExistMiddleware';
import { userNameExistsValidationMiddleware } from '../../../../src/Middleware/Validation/User/userNameExistsValidationMiddleware';
import { hashPasswordMiddleware } from '../../../../src/Middleware/Password/hashPasswordMiddleware';
import { createUserFromRequestMiddleware } from '../../../../src/Middleware/User/createUserFromRequestMiddleware';
import { saveUserToDatabaseMiddleware } from '../../../../src/Middleware/Database/saveUserToDatabaseMiddleware';
import { sendFormattedUserMiddleware } from '../../../../src/Middleware/User/sendFormattedUserMiddleware';

describe(`registerUserMiddlewares`, () => {

  test("check that exported array contains the necessary middlewares in the correct order", () => {

    expect.assertions(1);
    expect(registerUserMiddlewares).toEqual([
      userRegistrationValidationMiddleware,
      doesUserEmailExistMiddleware,
      emailExistsValidationMiddleware,
      doesUserNameExistMiddleware,
      userNameExistsValidationMiddleware,
      hashPasswordMiddleware,
      createUserFromRequestMiddleware,
      saveUserToDatabaseMiddleware,
      sendFormattedUserMiddleware
    ]);
  });

});
