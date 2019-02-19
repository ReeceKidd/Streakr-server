import { createSoloStreakMiddlewares } from '../../../../src/Routes/SoloStreak/createSoloStreakMiddlewares'
import { soloStreakRegistrationValidationMiddleware } from '../../../../src/Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware';
import { retreiveUserWithUserIdMiddleware } from '../../../../src/Middleware/Database/retreiveUserWithUserIdMiddleware';
import { userExistsValidationMiddleware } from '../../../../src/Middleware/Validation/User/userExistsValidationMiddleware';
import { createSoloStreakFromRequestMiddleware } from '../../../../src/Middleware/SoloStreak/createSoloStreakFromRequestMiddleware';
import { saveSoloStreakToDatabaseMiddleware } from '../../../../src/Middleware/Database/saveSoloStreakToDatabaseMiddleware';
import { sendFormattedSoloStreakMiddleware } from '../../../../src/Middleware/SoloStreak/sendFormattedSoloStreakMiddleware';

describe(`createSoloStreakMiddlewares`, () => {

    test("check that exported array contains the necessary middlewares in the correct order", () => {

        expect.assertions(1);
        expect(createSoloStreakMiddlewares).toEqual([
            soloStreakRegistrationValidationMiddleware,
            retreiveUserWithUserIdMiddleware,
            userExistsValidationMiddleware,
            createSoloStreakFromRequestMiddleware,
            saveSoloStreakToDatabaseMiddleware,
            sendFormattedSoloStreakMiddleware
        ]);
    });

});
