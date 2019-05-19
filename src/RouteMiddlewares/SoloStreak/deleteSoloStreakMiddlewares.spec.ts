import { deleteSoloStreakMiddlewares, soloStreakParamsValidationMiddleware, deleteSoloStreakMiddleware, soloStreakNotFoundMiddleware, getDeleteSoloStreakMiddleware, sendSoloStreakDeletedResponseMiddleware, getSoloStreakNotFoundMiddleware, getSendSoloStreakDeletedResponseMiddleware } from './deleteSoloStreakMiddlewares'
import { ResponseCodes } from '../../Server/responseCodes';

describe('soloStreakParamsValidationMiddleware', () => {

    test('that correct response is sent when soloStreakId is not defined', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakParamsValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: "child \"soloStreakId\" fails because [\"soloStreakId\" is required]"
        });
        expect(next).not.toBeCalled();
    })

    test('that correct response is sent when soloStreakId is not a string', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: { soloStreakId: 123 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakParamsValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: "child \"soloStreakId\" fails because [\"soloStreakId\" must be a string]"
        });
        expect(next).not.toBeCalled();
    })

})

describe('deleteSoloStreakMiddleware', () => {
    test('that when soloStreak is deleted successfully response.locals.deletedSoloStreak is defined and next is called', async () => {
        expect.assertions(3)
        const soloStreakId = 'abc123'
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true))
        const soloStreakModel = {
            findByIdAndDelete
        }
        const request: any = { params: { soloStreakId } }
        const response: any = { locals: {} }
        const next = jest.fn()
        const middleware = getDeleteSoloStreakMiddleware(soloStreakModel)
        await middleware(request, response, next)
        expect(findByIdAndDelete).toBeCalledWith(soloStreakId)
        expect(response.locals.deletedSoloStreak).toBeDefined()
        expect(next).toBeCalledWith()
    })

    test('that on error next is called with error', async () => {
        expect.assertions(1)
        const soloStreakId = 'abc123'
        const error = 'error'
        const findByIdAndDelete = jest.fn(() => Promise.reject(error))
        const soloStreakModel = {
            findByIdAndDelete
        }
        const request: any = { params: { soloStreakId } }
        const response: any = { locals: {} }
        const next = jest.fn()
        const middleware = getDeleteSoloStreakMiddleware(soloStreakModel)
        await middleware(request, response, next)
        expect(next).toBeCalledWith(error)
    })
})

describe('soloStreakNotFoundMiddleware', () => {

    test('that correct error response is sent whem deletedSoloStreak is not defined', () => {
        expect.assertions(3)
        const badRequestResponseCode = 404
        const localisedSoloStreakDoesNotExistMessage = 'Localised solo streak does not exist'
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {}
        const response: any = { locals: {}, status }
        const next = jest.fn()
        const middleware = getSoloStreakNotFoundMiddleware(badRequestResponseCode, localisedSoloStreakDoesNotExistMessage)
        middleware(request, response, next)
        expect(status).toBeCalledWith(badRequestResponseCode)
        expect(send).toBeCalledWith({ message: localisedSoloStreakDoesNotExistMessage })
        expect(next).not.toBeCalled()
    })

    test('that next is called when deletedSoloStreak is defined', () => {
        expect.assertions(1)
        const badRequestResponseCode = 404
        const localisedSoloStreakDoesNotExistMessage = 'Localised solo streak does not exist'
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {}
        const deletedSoloStreak = true
        const response: any = { locals: { deletedSoloStreak }, status }
        const next = jest.fn()
        const middleware = getSoloStreakNotFoundMiddleware(badRequestResponseCode, localisedSoloStreakDoesNotExistMessage)
        middleware(request, response, next)
        expect(next).toBeCalledWith()
    })

    test('that on error next is called with error', () => {
        expect.assertions(1)
        const badRequestResponseCode = 404
        const localisedSoloStreakDoesNotExistMessage = 'Localised solo streak does not exist'
        const request: any = {}
        const response: any = {}
        const next = jest.fn()
        const middleware = getSoloStreakNotFoundMiddleware(badRequestResponseCode, localisedSoloStreakDoesNotExistMessage)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `deletedSoloStreak` of 'undefined' or 'null'."))
    })

})

describe('sendSoloStreakDeletedResponseMiddleware', () => {

    test('that on deletion correct response is sent', () => {
        expect.assertions(3)
        const successfulDeletionResponseCode = 204
        const localisedSuccessfulDeletionMessage = 'Successfully deleted solo streak'
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const request: any = {}
        const response: any = { status }
        const next = jest.fn()
        const middleware = getSendSoloStreakDeletedResponseMiddleware(successfulDeletionResponseCode, localisedSuccessfulDeletionMessage)
        middleware(request, response, next)
        expect(status).toBeCalledWith(successfulDeletionResponseCode)
        expect(send).toBeCalledWith({ message: localisedSuccessfulDeletionMessage })
        expect(next).not.toBeCalled()
    })

    test('that on error next is called with error', () => {
        expect.assertions(1)
        const successfulDeletionResponseCode = 204
        const localisedSuccessfulDeletionMessage = 'Successfully deleted solo streak'
        const request: any = {}
        const response: any = {}
        const next = jest.fn()
        const middleware = getSendSoloStreakDeletedResponseMiddleware(successfulDeletionResponseCode, localisedSuccessfulDeletionMessage)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError('response.status is not a function'))
    })

})

describe('deleteSoloStreakMiddlewares', () => {
    test('that deleteSoloStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(5)
        expect(deleteSoloStreakMiddlewares.length).toEqual(4)
        expect(deleteSoloStreakMiddlewares[0]).toEqual(soloStreakParamsValidationMiddleware)
        expect(deleteSoloStreakMiddlewares[1]).toEqual(deleteSoloStreakMiddleware)
        expect(deleteSoloStreakMiddlewares[2]).toEqual(soloStreakNotFoundMiddleware)
        expect(deleteSoloStreakMiddlewares[3]).toEqual(sendSoloStreakDeletedResponseMiddleware)
    })
})

// Finish unit tests, intergration tests, get agenda time zone checks and then get this 
// thing on elastic beanstalk. 