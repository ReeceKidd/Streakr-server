import { createSoloStreakTaskMiddlewares, soloStreakTaskCompletedParamsValidationMiddleware, retreiveTimeZoneHeaderMiddleware, sendMissingTimeZoneErrorResponseMiddleware, validateTimeZoneMiddleware, sendInvalidTimeZoneErrorResponseMiddleware } from "./createSoloStreakTaskMiddlewares";

describe(`createSoloStreakTaskMiddlewares`, () => {
    test("that createSoloStreakTaskMiddlweares are defined in the correct order", async () => {
        expect.assertions(5);
        expect(createSoloStreakTaskMiddlewares[0]).toBe(soloStreakTaskCompletedParamsValidationMiddleware)
        expect(createSoloStreakTaskMiddlewares[1]).toBe(retreiveTimeZoneHeaderMiddleware)
        expect(createSoloStreakTaskMiddlewares[2]).toBe(sendMissingTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakTaskMiddlewares[3]).toBe(validateTimeZoneMiddleware)
        expect(createSoloStreakTaskMiddlewares[4]).toBe(sendInvalidTimeZoneErrorResponseMiddleware)
    });
});