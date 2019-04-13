import { getSoloStreaksMiddlewares, getSoloStreaksValidationMiddleware, getFindSoloStreaksMiddleware, findSoloStreaksMiddleware, sendSoloStreaksMiddleware } from "./getSoloStreaksMiddlewares";

describe('getSoloStreaksValidationMiddleware', () => {
    test("check that valid request passes", () => {
        expect.assertions(1);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: { userId: '1234' }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getSoloStreaksValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test("check that request with no params fails", () => {
        expect.assertions(3)

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getSoloStreaksValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();
    })

    test("check that userId cannot be a number", () => {
        expect.assertions(3)

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: { userId: 123 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        getSoloStreaksValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    })
})

describe('findSoloStreaksMiddleware', () => {
    test('check that soloStreaks are retreived correctly', async () => {
        expect.assertions(2);

        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find
        }
        const request: any = { params: { userId: '1234' } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getFindSoloStreaksMiddleware(soloStreakModel);

        await middleware(request, response, next);

        expect(response.locals.soloStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    })

    test('checks that next is called with error if database call fails', async () => {
        expect.assertions(2);

        const ERROR_MESSAGE = 'error'
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const soloStreakModel = {
            find
        }
        const request: any = { params: { userId: '1234' } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getFindSoloStreaksMiddleware(soloStreakModel);

        await middleware(request, response, next);

        expect(response.locals.friends).toBe(undefined)
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    })
})

describe(`getSoloStreaksMiddlewares`, () => {
    test("that getSoloStreaksMiddlewares are defined in the correct order", async () => {
        expect.assertions(3)
        expect(getSoloStreaksMiddlewares[0]).toBe(getSoloStreaksValidationMiddleware)
        expect(getSoloStreaksMiddlewares[1]).toBe(findSoloStreaksMiddleware)
        expect(getSoloStreaksMiddlewares[2]).toBe(sendSoloStreaksMiddleware)
    });
});