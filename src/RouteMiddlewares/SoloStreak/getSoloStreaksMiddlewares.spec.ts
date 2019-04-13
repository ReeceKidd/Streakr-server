import { getSoloStreaksMiddlewares, getSoloStreaksValidationMiddleware, getRetreiveUserMiddleware, retreiveUserMiddleware, getUserExistsValidationMiddleware, userExistsValidationMiddleware, getFindSoloStreaksMiddleware, findSoloStreaksMiddleware, sendSoloStreaksMiddleware } from "./getSoloStreaksMiddlewares";

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

describe(`retreiveUserMiddleware`, () => {

    const mockUserId = "abcdefghij123";
    const ERROR_MESSAGE = "error";


    test("should define response.locals.user when user is found", async () => {
        expect.assertions(3);

        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        }
        const request: any = { params: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserMiddleware(UserModel);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(true);
        expect(next).toBeCalledWith();
    });

    test("should send error response when user doesn't exist", async () => {
        expect.assertions(3);

        const findOne = jest.fn(() => Promise.resolve(undefined));
        const UserModel = {
            findOne
        }
        const request: any = { params: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserMiddleware(UserModel);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(undefined);
        expect(next).toBeCalledWith();
    });

    test("should call next() with err paramater if database call fails", async () => {
        expect.assertions(3);

        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        }
        const request: any = { params: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserMiddleware(UserModel);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
});

describe(`userExistsValidationMiddleware`, () => {
    const mockErrorMessage = 'User does not exist'

    test("check that error response is returned correctly when user wasn't found", async () => {
        expect.assertions(2);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {};
        const response: any = {
            locals: {},
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request, response, next);

        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({ message: mockErrorMessage });
    });

    test("check that next is called when user is defined on response.locals", () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {};
        const response: any = {
            locals: { user: true },
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request, response, next);

        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(next).toBeCalledWith();
    });

    test("check that next is called with err on send failure", () => {
        expect.assertions(1);

        const errorMessage = 'error'
        const send = jest.fn(() => { throw new Error(errorMessage) });
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = {
            locals: { user: false },
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});

describe('findSoloStreaksMiddleware', () => {
    test('check that soloStreaks are retreived correctly', async () => {
        expect.assertions(2);

        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find
        }
        const request: any = {};
        const response: any = { locals: { user: { _id: '123' } } };
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
        const request: any = {};
        const response: any = { locals: { user: { _id: '123' } } };
        const next = jest.fn();

        const middleware = getFindSoloStreaksMiddleware(soloStreakModel);

        await middleware(request, response, next);

        expect(response.locals.friends).toBe(undefined)
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    })
})

describe(`getSoloStreaksMiddlewares`, () => {
    test("that getSoloStreaksMiddlewares are defined in the correct order", async () => {
        expect.assertions(5)
        expect(getSoloStreaksMiddlewares[0]).toBe(getSoloStreaksValidationMiddleware)
        expect(getSoloStreaksMiddlewares[1]).toBe(retreiveUserMiddleware)
        expect(getSoloStreaksMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(getSoloStreaksMiddlewares[3]).toBe(findSoloStreaksMiddleware)
        expect(getSoloStreaksMiddlewares[4]).toBe(sendSoloStreaksMiddleware)
    });
});