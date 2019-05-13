import { getSoloStreakMiddlewares, retreiveSoloStreakMiddleware, getRetreiveSoloStreakMiddleware, sendSoloStreakMiddleware, getSoloStreakParamsValidationMiddleware, getSendSoloStreakMiddleware } from "./getSoloStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe(`getSoloStreakParamsValidationMiddleware`, () => {

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

        getSoloStreakParamsValidationMiddleware(request, response, next);
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

        getSoloStreakParamsValidationMiddleware(request, response, next);

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

        getSoloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

});

describe('retreiveSoloStreakMiddleware', () => {
    test('that response.locals.soloStreak is defined and next() is called', async () => {
        expect.assertions(3)
        const lean = jest.fn(() => Promise.resolve(true))
        const findOne = jest.fn(() => ({ lean }))
        const soloStreakModel = {
            findOne
        }
        const soloStreakId = 'abcd'
        const request: any = { params: { soloStreakId } }
        const response: any = { locals: {} }
        const next = jest.fn()
        const middleware = getRetreiveSoloStreakMiddleware(soloStreakModel)
        await middleware(request, response, next)
        expect(findOne).toBeCalledWith({ _id: soloStreakId })
        expect(response.locals.soloStreak).toBeDefined()
        expect(next).toBeCalledWith()
    })

    test('that on error next() is called with error', async () => {
        expect.assertions(1)
        const errorMessage = 'error'
        const lean = jest.fn(() => Promise.reject(errorMessage))
        const findOne = jest.fn(() => ({ lean }))
        const soloStreakModel = {
            findOne
        }
        const soloStreakId = 'abcd'
        const request: any = { params: { soloStreakId } }
        const response: any = { locals: {} }
        const next = jest.fn()
        const middleware = getRetreiveSoloStreakMiddleware(soloStreakModel)
        await middleware(request, response, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

describe('sendSoloStreakMiddleware', () => {
    test('that soloStreak is sent correctly', () => {
        expect.assertions(3);
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const soloStreak = { _id: 'abc' }
        const request: any = {}
        const response: any = { locals: { soloStreak }, status };
        const next = jest.fn();

        const resourceCreatedCode = 401
        const middleware = getSendSoloStreakMiddleware(resourceCreatedCode)
        middleware(request, response, next);

        expect(next).not.toBeCalled()
        expect(status).toBeCalledWith(resourceCreatedCode)
        expect(send).toBeCalledWith({ ...soloStreak })

    })

    test('that on error next is called with error', async () => {
        expect.assertions(1)
        const request: any = {}
        const error = 'error'
        const send = jest.fn(() => Promise.reject(error))
        const status = jest.fn(() => ({ send }))
        const response: any = { status }
        const next = jest.fn()
        const resourceCreatedResponseCode = 401
        const middleware = getSendSoloStreakMiddleware(resourceCreatedResponseCode)
        await middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `soloStreak` of 'undefined' or 'null'."))
    })
})

describe('getSoloStreakMiddlewares', () => {

    test('that getSoloStreakMiddlewares are defined in the correct order', () => {
        expect(getSoloStreakMiddlewares).toEqual([
            getSoloStreakParamsValidationMiddleware,
            retreiveSoloStreakMiddleware,
            sendSoloStreakMiddleware
        ])
    })
})