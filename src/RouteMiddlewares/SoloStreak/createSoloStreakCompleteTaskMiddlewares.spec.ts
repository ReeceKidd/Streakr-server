import {
    createSoloStreakCompleteTaskMiddlewares,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    retreiveUserMiddleware,
    sendUserDoesNotExistErrorMiddleware,
    setCurrentTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    sendTaskCompleteResponseMiddleware,
    defineTaskCompleteMiddleware,
    soloStreakTaskCompleteParamsValidationMiddleware,
    soloStreakExistsMiddleware,
    sendSoloStreakDoesNotExistErrorMessageMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
} from "./createSoloStreakCompleteTaskMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe(`soloStreakTaskCompleteParamsValidaionMiddleware`, () => {

    const soloStreakId = '12345678'

    test("that next() is called when correct params are supplied", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: { soloStreakId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakTaskCompleteParamsValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    });


    test("that correct response is sent when soloStreakId is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakTaskCompleteParamsValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when soloStreakId is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: { soloStreakId: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakTaskCompleteParamsValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

});

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
        expect(createSoloStreakCompleteTaskMiddlewares[7]).toBe(retreiveUserMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[8]).toBe(sendUserDoesNotExistErrorMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[9]).toBe(setCurrentTimeMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[10]).toBe(setDayTaskWasCompletedMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[11]).toBe(hasTaskAlreadyBeenCompletedTodayMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[12]).toBe(sendTaskAlreadyCompletedTodayErrorMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[13]).toBe(defineTaskCompleteMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[14]).toBe(saveTaskCompleteMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[15]).toBe(streakMaintainedMiddleware)
        expect(createSoloStreakCompleteTaskMiddlewares[16]).toBe(sendTaskCompleteResponseMiddleware)
    });
});