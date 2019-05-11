import { getSoloStreakMiddlewares, retreiveSoloStreakMiddleware, getRetreiveSoloStreakMiddleware, sendSoloStreakMiddleware, getSoloStreakParamsValidationMiddleware } from "./getSoloStreakMiddlewares";

describe('findSoloStreakMiddleware', () => {
    test('that response.locals.soloStreak is defined and next() is called', async () => {
        expect.assertions(3)
        const findOne = jest.fn(() => Promise.resolve(true))
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
        const findOne = jest.fn(() => Promise.reject(errorMessage))
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

describe('getSoloStreakMiddlewares', () => {

    test('that getSoloStreakMiddlewares are defined in the correct order', () => {
        expect(getSoloStreakMiddlewares).toEqual([
            getSoloStreakParamsValidationMiddleware,
            retreiveSoloStreakMiddleware,
            sendSoloStreakMiddleware
        ])
    })
})