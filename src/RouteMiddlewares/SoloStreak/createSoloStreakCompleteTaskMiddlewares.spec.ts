import {
    createSoloStreakCompleteTaskMiddlewares,
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
} from "./createSoloStreakCompleteTaskMiddlewares";

describe(`createSoloStreakCompleteTaskMiddlewares`, () => {
    test("that createSoloStreakTaskMiddlweares are defined in the correct order", async () => {
        expect.assertions(17);
        expect(createSoloStreakCompleteTaskMiddlewares[0]).toBe(soloStreakTaskCompleteParamsValidationMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[1]).toBe(soloStreakExistsMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[2]).toBe(sendSoloStreakDoesNotExistErrorMessageMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[3]).toBe(retreiveTimeZoneHeaderMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[4]).toBe(sendMissingTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[5]).toBe(validateTimeZoneMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[6]).toBe(sendInvalidTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[7]).toBe(retreiveUserCalendarMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[8]).toBe(sendUserCalendarDoesNotExistErrorMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[9]).toBe(setCurrentTimeMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[10]).toBe(setDayTaskWasCompletedMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[11]).toBe(hasTaskAlreadyBeenCompletedTodayMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[12]).toBe(sendTaskAlreadyCompletedTodayErrorMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[13]).toBe(defineTaskCompleteMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[14]).toBe(addTaskCompleteToUserCalendarMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[15]).toBe(addTaskCompleteToSoloStreakActivityLogMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[16]).toBe(sendTaskCompleteResponseMiddleware)
    });
});