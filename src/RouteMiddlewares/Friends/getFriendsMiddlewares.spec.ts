import { getFriendsMiddlewares, getFriendsValidationMiddleware, formatFriendsMiddleware, userExistsValidationMiddleware, getUserExistsValidationMiddleware, retreiveFriendsMiddleware, sendFormattedFriendsMiddleware, getRetreiveUserMiddleware, retreiveUserMiddleware, getRetreiveFriendsMiddleware } from "./getFriendsMiddlewares";
import { IUser } from "Models/User";

describe(`getFriendsValidationMiddleware`, () => {

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

        getFriendsValidationMiddleware(request, response, next);

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

        getFriendsValidationMiddleware(request, response, next);

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

        getFriendsValidationMiddleware(request, response, next);

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

describe('getRetreiveFriendsMiddleware', () => {
    test('check that friends are retreived correctly', async () => {
        expect.assertions(3);

        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        }
        const request: any = {};
        const response: any = { locals: { user: { friends: ['123', '124', '125'] } } };
        const next = jest.fn();

        const middleware = getRetreiveFriendsMiddleware(UserModel);

        await middleware(request, response, next);

        expect(findOne).toBeCalledTimes(3)
        expect(response.locals.friends).toEqual([true, true, true]);
        expect(next).toBeCalledWith();
    })

    test('checks that next is called with error if database call fails', async () => {
        expect.assertions(2);

        const ERROR_MESSAGE = 'error'
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        }
        const request: any = {};
        const response: any = { locals: { user: { friends: ['123', '124', '125'] } } };
        const next = jest.fn();

        const middleware = getRetreiveFriendsMiddleware(UserModel);

        await middleware(request, response, next);

        expect(response.locals.friends).toBe(undefined)
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    })
})

describe(`formatFriendsMiddleware`, () => {

    test('checks that response.locals.formattedFriends contains a correctly formatted user', () => {
        expect.assertions(2);

        const mockFriend = {
            toObject: jest.fn(() => {
                return {
                    _id: '1234',
                    userName: 'test',
                    email: 'test@test.com',
                    password: '12345678',
                    role: 'Admin',
                    preferredLanguage: 'English'
                }
            })
        }

        const request: any = {};
        const response: any = { locals: { friends: [mockFriend] } };
        const next = jest.fn();

        formatFriendsMiddleware(request, response, next);

        const formattedFriend = {
            ...mockFriend.toObject(),
            password: undefined,
        }

        expect(response.locals.formattedFriends[0]).toEqual({
            ...formattedFriend
        })
        expect(next).toBeCalledWith();
    })

    test('checks that errors are passed into the next middleware', () => {
        expect.assertions(2);

        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();

        formatFriendsMiddleware(request, response, next);

        expect(response.locals.formattedFriends).toBe(undefined)
        expect(next).toBeCalledWith(new TypeError(`Cannot read property 'map' of undefined`))
    })
})

describe('sendFormattedFriendsMiddleware', () => {
    test("should send formattedFriends in response", () => {

        const send = jest.fn()
        const request: any = {}
        const formattedFriends = ['friend']
        const response: any = { locals: { formattedFriends }, send }
        const next = jest.fn();

        sendFormattedFriendsMiddleware(request, response, next);

        expect.assertions(2);
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith({ friends: formattedFriends })
    });

    test("should call next with an error on failure", () => {

        const ERROR_MESSAGE = 'sendFormattedFriendsMiddleware error'
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const response: any = { locals: {}, send };

        const request: any = {}
        const next = jest.fn();

        sendFormattedFriendsMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })
})

describe(`getFriendsMiddlewares`, () => {
    test("that getFriendsMiddlewares are defined in the correct order", () => {
        expect.assertions(6);
        expect(getFriendsMiddlewares[0]).toBe(getFriendsValidationMiddleware)
        expect(getFriendsMiddlewares[1]).toBe(retreiveUserMiddleware)
        expect(getFriendsMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(getFriendsMiddlewares[3]).toBe(retreiveFriendsMiddleware)
        expect(getFriendsMiddlewares[4]).toBe(formatFriendsMiddleware)
        expect(getFriendsMiddlewares[5]).toBe(sendFormattedFriendsMiddleware)
    });
});