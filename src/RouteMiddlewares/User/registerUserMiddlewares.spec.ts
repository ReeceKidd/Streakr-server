import { registerUserMiddlewares } from './registerUserMiddlewares'
import { userRegistrationValidationMiddleware } from '../../Middleware/Validation/User/userRegistrationValidationMiddleware';
import { doesUserEmailExistMiddleware } from '../../Middleware/Database/doesUserEmailExistMiddleware';
import { emailExistsValidationMiddleware } from '../../Middleware/Validation/User/emailExistsValidationMiddleware';
import { doesUserNameExistMiddleware } from '../../Middleware/Database/doesUserNameExistMiddleware';
import { userNameExistsValidationMiddleware } from '../../Middleware/Validation/User/userNameExistsValidationMiddleware';
import { hashPasswordMiddleware } from '../../Middleware/Password/hashPasswordMiddleware';
import { createUserFromRequestMiddleware } from '../../Middleware/User/createUserFromRequestMiddleware';
import { saveUserToDatabaseMiddleware } from '../../Middleware/Database/saveUserToDatabaseMiddleware';
import { sendFormattedUserMiddleware } from '../../Middleware/User/sendFormattedUserMiddleware';

describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
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
        ])
    });
});