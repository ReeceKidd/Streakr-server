import {
    createSoloStreakTaskCompleteMiddlewares,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    retreiveUserCalendarMiddleware,
    sendUserCalendarDoesNotExistErrorMiddleware,
    setCurrentTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    addTaskCompleteToUserCalendarMiddleware,
    sendTaskCompleteResponseMiddleware,
    defineTaskCompleteMiddleware,
    soloStreakTaskCompleteParamsValidationMiddleware,
    soloStreakExistsMiddleware,
    sendSoloStreakDoesNotExistErrorMessageMiddleware,
    addTaskCompleteToSoloStreakActivityLogMiddleware
} from "./createSoloStreakTaskCompleteMiddlewares";

describe(`createSoloStreakTaskCompleteMiddlewares`, () => {
    test("that createSoloStreakTaskMiddlweares are defined in the correct order", async () => {
        expect.assertions(17);
        expect(createSoloStreakTaskCompleteMiddlewares[0]).toBe(soloStreakTaskCompleteParamsValidationMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[1]).toBe(soloStreakExistsMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[2]).toBe(sendSoloStreakDoesNotExistErrorMessageMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[3]).toBe(retreiveTimeZoneHeaderMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[4]).toBe(sendMissingTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[5]).toBe(validateTimeZoneMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[6]).toBe(sendInvalidTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[7]).toBe(retreiveUserCalendarMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[8]).toBe(sendUserCalendarDoesNotExistErrorMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[9]).toBe(setCurrentTimeMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[10]).toBe(setDayTaskWasCompletedMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[11]).toBe(hasTaskAlreadyBeenCompletedTodayMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[12]).toBe(sendTaskAlreadyCompletedTodayErrorMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[13]).toBe(defineTaskCompleteMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[14]).toBe(addTaskCompleteToUserCalendarMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[15]).toBe(addTaskCompleteToSoloStreakActivityLogMiddleware)
        expect(createSoloStreakTaskCompleteMiddlewares[16]).toBe(sendTaskCompleteResponseMiddleware)
    });
});