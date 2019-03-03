import { verifyJsonWebTokenMiddlewares } from './verifyJsonWebTokenMiddlewares'
import { retreiveJsonWebTokenMiddleware } from '../../Middleware/Auth/retreiveJsonWebTokenMiddleware';
import { jsonWebTokenDoesNotExistResponseMiddleware } from '../../Middleware/Validation/Auth/jsonWebTokenDoesNotExistResponseMiddleware';
import { decodeJsonWebTokenMiddleware } from '../../Middleware/Auth/decodeJsonWebTokenMiddleware';
import { jsonWebTokenErrorResponseMiddleware } from '../../Middleware/ErrorHandler/jsonWebTokenErrorResponseMiddleware';


describe(`verifyJsonWebTokenMiddlewares`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(1);
        expect(verifyJsonWebTokenMiddlewares).toEqual([
            retreiveJsonWebTokenMiddleware,
            jsonWebTokenDoesNotExistResponseMiddleware,
            decodeJsonWebTokenMiddleware,
            jsonWebTokenErrorResponseMiddleware
        ])
    });
});