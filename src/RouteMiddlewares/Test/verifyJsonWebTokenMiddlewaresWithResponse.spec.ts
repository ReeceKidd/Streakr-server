import { verifyJsonWebTokenMiddlewaresWithResponse } from './verifyJsonWebTokenMiddlewaresWithResponse'
import { verifyJsonWebTokenMiddlewares } from '../Utils/verifyJsonWebTokenMiddlewares';
import { jsonWebTokenVerificationSuccessfulMiddleware } from '../../Middleware/Handlers/jsonWebTokenVerificationSuccessfulMiddleware';

describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(1);
        expect(verifyJsonWebTokenMiddlewaresWithResponse).toEqual([
            verifyJsonWebTokenMiddlewares,
            jsonWebTokenVerificationSuccessfulMiddleware
        ])
    });
});