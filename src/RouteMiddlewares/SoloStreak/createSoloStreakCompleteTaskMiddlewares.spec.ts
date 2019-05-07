import {
    createSoloStreakCompleteTaskMiddlewares,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    retreiveUserMiddleware,
    getValidateTimeZoneMiddleware,
    getSendInvalidTimeZoneErrorResponseMiddleware,
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
    getSoloStreakExistsMiddleware,
    getSendSoloStreakDoesNotExistErrorMessageMiddleware,
    getRetreiveTimeZoneHeaderMiddleware,
    getSendMissingTimeZoneErrorResponseMiddleware,
    getRetreiveUserMiddleware,
} from "./createSoloStreakCompleteTaskMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe(`soloStreakTaskCompleteParamsValidationMiddleware`, () => {

    const soloStreakId = '12345678'

    test("that next() is called when correct params are supplied", () => {
        expect.assertions(1);
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
        expect(next).toBeCalled();
    });


    test("that correct response is sent when soloStreakId is missing", () => {
        expect.assertions(3);
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

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when soloStreakId is not a string", () => {
        expect.assertions(3);
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

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

});

describe('soloStreakExistsMiddleware', () => {

    test('that response.locals.soloStreak is defined and next() is called', async () => {
        expect.assertions(3)
        const soloStreakId = 'abc'
        const request: any = {
            params: { soloStreakId }
        }
        const response: any = { locals: {} }
        const next = jest.fn()

        const findOne = jest.fn(() => Promise.resolve(true))
        const soloStreakModel = { findOne }

        const middleware = getSoloStreakExistsMiddleware(soloStreakModel)
        await middleware(request, response, next)

        expect(findOne).toBeCalledWith({ _id: soloStreakId })
        expect(response.locals.soloStreak).toBeDefined()
        expect(next).toBeCalledWith()
    })

    test('on error next() is called with error', async () => {
        expect.assertions(1)
        const request: any = {
        }
        const response: any = { locals: {} }
        const next = jest.fn()

        const findOne = jest.fn(() => Promise.resolve(true))
        const soloStreakModel = { findOne }

        const middleware = getSoloStreakExistsMiddleware(soloStreakModel)
        await middleware(request, response, next)

        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `soloStreakId` of 'undefined' or 'null'."))
    })

})

describe('sendSoloStreakDoesNotExistErrorMessageMiddleware', () => {
    test('that error response is sent when response.locals.soloStreak is not defined', async () => {
        expect.assertions(3)
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {
        }
        const response: any = { locals: {}, status }
        const next = jest.fn()

        const unprocessableEntityStatus = 402
        const localisedErrorMessage = 'error'

        const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(unprocessableEntityStatus, localisedErrorMessage)
        middleware(request, response, next)
        expect(status).toBeCalledWith(unprocessableEntityStatus)
        expect(send).toBeCalledWith({ message: localisedErrorMessage })
        expect(next).not.toBeCalledWith()
    })

    test('that next() is called when response.locals.soloStreak is defined', async () => {
        expect.assertions(1)
        const soloStreak = {
            soloStreakName: 'Test soloStreak'
        }
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {
        }
        const response: any = { locals: { soloStreak }, status }
        const next = jest.fn()

        const unprocessableEntityStatus = 402
        const localisedErrorMessage = 'error'

        const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(unprocessableEntityStatus, localisedErrorMessage)
        middleware(request, response, next)
        expect(next).toBeCalledWith()
    })

    test('that next is called with error on error', () => {
        expect.assertions(1)
        const request: any = {
        }
        const response: any = { locals: {} }
        const next = jest.fn()

        const unprocessableEntityStatus = 402
        const localisedErrorMessage = 'error'

        const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(unprocessableEntityStatus, localisedErrorMessage)
        middleware(request, response, next)

        expect(next).toBeCalledWith(new TypeError("response.status is not a function"))
    })
})

describe('retreiveTimeZoneHeaderMiddleware', () => {

    test('that response.locals.timeZone is defined and next() is called', () => {
        expect.assertions(3)
        const header = jest.fn(() => true)
        const timeZoneHeader = 'Europe/London'
        const request: any = {
            header
        }
        const response: any = {
            locals: {}
        }
        const next = jest.fn()
        const middleware = getRetreiveTimeZoneHeaderMiddleware(timeZoneHeader)
        middleware(request, response, next)
        expect(header).toBeCalledWith(timeZoneHeader)
        expect(response.locals.timeZone).toBeDefined()
        expect(next).toBeCalledWith()
    })

    test('on error that next is called with error', () => {
        expect.assertions(1)
        const timeZoneHeader = 'Europe/London'
        const request: any = {
        }
        const response: any = {
            locals: {}
        }
        const next = jest.fn()
        const middleware = getRetreiveTimeZoneHeaderMiddleware(timeZoneHeader)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("request.header is not a function"))
    })
})

describe('sendMissingTimeZoneErrorResponseMiddleware', () => {

    test('that error response is sent correctly when timeZone is not defined', () => {
        expect.assertions(3)
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {}
        const response: any = { status, locals: {} }
        const next = jest.fn()
        const unprocessableEntityCode = 422
        const localisedError = 'error'
        const middleware = getSendMissingTimeZoneErrorResponseMiddleware(unprocessableEntityCode, localisedError)
        middleware(request, response, next)
        expect(status).toBeCalledWith(unprocessableEntityCode)
        expect(send).toBeCalledWith({ message: localisedError })
        expect(next).not.toBeCalled()
    })

    test('that next() is called when timeZone is defined', () => {
        expect.assertions(1)
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const timeZone = 'Europe/London'
        const request: any = {}
        const response: any = { status, locals: { timeZone } }
        const next = jest.fn()
        const unprocessableEntityCode = 422
        const localisedError = 'error'
        const middleware = getSendMissingTimeZoneErrorResponseMiddleware(unprocessableEntityCode, localisedError)
        middleware(request, response, next)
        expect(next).toBeCalledWith()
    })
})

describe('validateTimeZoneMiddleware', () => {

    test('that response.locals.validTimeZone is defined and next() is called', () => {
        expect.assertions(3)
        const timeZone = 'Europe/London'
        const request: any = {}
        const response: any = { locals: { timeZone } }
        const next = jest.fn()
        const isValidTimeZone = jest.fn(() => true)
        const middleware = getValidateTimeZoneMiddleware(isValidTimeZone)
        middleware(request, response, next)
        expect(response.locals.validTimeZone).toBeDefined()
        expect(isValidTimeZone).toBeCalledWith(timeZone)
        expect(next).toBeCalledWith()
    })

    test('that on error next is called with error', () => {
        expect.assertions(1)
        const timeZone = 'Europe/London'
        const request: any = {}
        const response: any = { locals: { timeZone } }
        const next = jest.fn()
        const middleware = getValidateTimeZoneMiddleware(null)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("isValidTimeZone is not a function"))
    })

})

describe('sendInvalidTimeZoneErrorResponseMiddleware', () => {

    test('that error response is sent correctly when validTimeZone is not defined', () => {
        expect.assertions(3)
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {}
        const response: any = { locals: {}, status }
        const next = jest.fn()
        const unprocessableEntityCode = 422
        const localisedError = 'error'
        const middleware = getSendInvalidTimeZoneErrorResponseMiddleware(unprocessableEntityCode, localisedError)
        middleware(request, response, next)
        expect(status).toBeCalledWith(unprocessableEntityCode)
        expect(send).toBeCalledWith({ message: localisedError })
        expect(next).not.toBeCalled()
    })

    test('that error response is sent correctly when timeZone is missing', () => {
        expect.assertions(3)
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {}
        const validTimeZone = 'Europe/London'
        const response: any = { locals: { validTimeZone } }
        const next = jest.fn()
        const unprocessableEntityCode = 422
        const localisedError = 'error'
        const middleware = getSendInvalidTimeZoneErrorResponseMiddleware(unprocessableEntityCode, localisedError)
        middleware(request, response, next)
        expect(status).not.toBeCalled()
        expect(send).not.toBeCalled()
        expect(next).toBeCalledWith()
    })

    test('that on failure next is called with error', () => {

    })

})

describe('retreiveUserMiddleware', () => {

    test('that response.locals.user is defined and next() is called', async () => {
        expect.assertions(4)
        const _id = 'abcd'
        const minimumUserData = { _id }
        const lean = jest.fn(() => true)
        const findOne = jest.fn(() => ({ lean }))
        const userModel = { findOne }
        const request: any = {}
        const response: any = { locals: { minimumUserData } }
        const next = jest.fn()
        const middleware = getRetreiveUserMiddleware(userModel)
        await middleware(request, response, next)
        expect(response.locals.user).toBeDefined()
        expect(findOne).toBeCalledWith({ _id: minimumUserData._id })
        expect(lean).toBeCalledWith()
        expect(next).toBeCalledWith()
    })

    test('on error next is called with error', async () => {
        expect.assertions(1)
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const _id = 'abcd'
        const minimumUserData = { _id }
        const findOne = jest.fn(() => ({}))
        const userModel = { findOne }
        const request: any = {}
        const response: any = { status, locals: { minimumUserData } }
        const next = jest.fn()
        const middleware = getRetreiveUserMiddleware(userModel)
        await middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("userModel.findOne(...).lean is not a function"))
    })
})

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