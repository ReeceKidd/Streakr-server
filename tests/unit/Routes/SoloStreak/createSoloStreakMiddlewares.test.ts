import { createSoloStreakMiddlewares } from '../../../../src/Routes/SoloStreak/createSoloStreakMiddlewares'
import { soloStreakRegistrationValidationMiddleware } from '../../../../src/Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware';

describe(`createSoloStreakMiddlewares`, () => {

    test("check that exported array contains the necessary middlewares in the correct order", () => {

        expect.assertions(1);
        expect(createSoloStreakMiddlewares).toEqual([
            soloStreakRegistrationValidationMiddleware
        ]);
    });

});
