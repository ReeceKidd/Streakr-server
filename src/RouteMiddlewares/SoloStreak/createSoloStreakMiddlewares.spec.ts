import { createSoloStreakMiddlewares } from './createSoloStreakMiddlewares'
import { soloStreakRegistrationValidationMiddleware } from '../../Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware';
import { retreiveUserWithUserIdMiddleware } from '../../Middleware/Database/retreiveUserWithUserIdMiddleware';
import { userExistsValidationMiddleware } from '../../Middleware/Validation/User/userExistsValidationMiddleware';
import { createSoloStreakFromRequestMiddleware } from '../../Middleware/SoloStreak/createSoloStreakFromRequestMiddleware';
import { saveSoloStreakToDatabaseMiddleware } from '../../Middleware/Database/saveSoloStreakToDatabaseMiddleware';
import { sendFormattedSoloStreakMiddleware } from '../../Middleware/SoloStreak/sendFormattedSoloStreakMiddleware';

describe(`createSoloStreakMiddlewares`, () => {
    test("that createSoloStreak middlewares are defined in the correct order", async () => {
        expect.assertions(1);
        expect(createSoloStreakMiddlewares).toEqual([
            soloStreakRegistrationValidationMiddleware,
            retreiveUserWithUserIdMiddleware,
            userExistsValidationMiddleware,
            createSoloStreakFromRequestMiddleware,
            saveSoloStreakToDatabaseMiddleware,
            sendFormattedSoloStreakMiddleware
        ])
    });
});
