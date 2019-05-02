import { createSoloStreakTaskCompleteMiddlewares, soloStreakTaskCompletedParamsValidationMiddleware, retreiveTimeZoneHeaderMiddleware, sendMissingTimeZoneErrorResponseMiddleware, validateTimeZoneMiddleware, sendInvalidTimeZoneErrorResponseMiddleware, hasTaskAlreadyBeenCompletedTodayMiddleware, sendTaskAlreadyCompletedTodayErrorMiddleware, retreiveSoloStreakMiddleware, sendSoloStreakDoesNotExistErrorMiddleware, setCurrentTimeMiddleware, setDayTaskWasCompletedMiddleware, addTaskCompleteToSoloStreakMiddleware, sendUpdatedSoloStreakMiddleware } from "./createSoloStreakTaskCompleteMiddlewares";

describe(`createSoloStreakTaskCompleteMiddlewares`, () => {
    test("that createSoloStreakTaskMiddlweares are defined in the correct order", async () => {
        expect.assertions(9);
        expect(createSoloStreakTaskCompleteMiddlewares[0]).toBe(soloStreakTaskCompletedParamsValidationMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[1]).toBe(retreiveTimeZoneHeaderMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[2]).toBe(sendMissingTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[3]).toBe(validateTimeZoneMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[4]).toBe(sendInvalidTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[5]).toBe(retreiveSoloStreakMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[6]).toBe(sendSoloStreakDoesNotExistErrorMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[7]).toBe(setCurrentTimeMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[8]).toBe(setDayTaskWasCompletedMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[7]).toBe(hasTaskAlreadyBeenCompletedTodayMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[8]).toBe(sendTaskAlreadyCompletedTodayErrorMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[7]).toBe(addTaskCompleteToSoloStreakMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[8]).toBe(sendUpdatedSoloStreakMiddleware)
    });
});