import { Request, Response, NextFunction } from 'express'

import { addFriendMiddlewares, addFriendValidationMiddleware, retreiveUserMiddleware, userExistsValidationMiddleware, getAddFriendMiddleware, addFriendMiddleware, getRetreiveUserMiddleware, getUserExistsValidationMiddleware, sendFriendAddedSuccessMessageMiddleware, getSendFriendAddedSuccessMessageMiddleware, getFriendAlreadyExistsMiddleware, getRetreiveFriendsDetailsMiddleware, friendAlreadyExistsMiddleware, retreiveFriendsDetailsMiddleware, formatFriendsMiddleware } from "./addFriendMiddlewares";

describe('addFriendValidationMiddleware', () => {

    const mockUserId = '1234'
    const mockFriendId = '2345'

    test('that valid request passes', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: mockUserId, friendId: mockFriendId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith();

    })

    test('that request fails when userId is missing from body', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { friendId: mockFriendId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendValidationMiddleware(request, response, next);

        expect.assertions(3)
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();

    })

    test('that request fails when userId is not a string', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: 1234, friendId: mockFriendId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendValidationMiddleware(request, response, next);

        expect.assertions(3)
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();

    })

    test('that request fails when friendId is missing from body', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: mockUserId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendValidationMiddleware(request, response, next);

        expect.assertions(3)
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "friendId" fails because ["friendId" is required]'
        });
        expect(next).not.toBeCalled();

    })

    test('that request fails when friendId is not a string', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: mockUserId, friendId: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendValidationMiddleware(request, response, next);

        expect.assertions(3)
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "friendId" fails because ["friendId" must be a string]'
        });
        expect(next).not.toBeCalled();

    })
})

describe(`retreiveUserMiddleware`, () => {

    const mockUserId = "abcdefghij123";
    const ERROR_MESSAGE = "error";


    test("should define response.locals.user when user is found", async () => {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        }
        const request: any = { body: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(true);
        expect(next).toBeCalled();
    });

    test("should not define response.locals.user when user doesn't exist", async () => {
        const findOne = jest.fn(() => Promise.resolve(undefined));
        const UserModel = {
            findOne
        }
        const request: any = { body: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(undefined);
        expect(next).toBeCalledWith();
    });

    test("should call next() with err paramater if database call fails", async () => {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        }
        const request: any = { body: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
});

describe(`userExistsValidationMiddleware`, () => {
    const mockErrorMessage = 'User does not exist'

    test("check that error response is returned correctly when user wasn't found", async () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {};
        const response: any = {
            locals: {},
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(2);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({ message: mockErrorMessage });
    });

    test("check that next is called when user is defined on response.locals", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request = {};
        const response: any = {
            locals: { user: true },
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(3);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test("check that next is called with err on send failure", () => {
        const errorMessage = 'error'
        const send = jest.fn(() => { throw new Error(errorMessage) });
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response: any = {
            locals: { user: false },
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});

describe(`friendAlreadyExistsMiddleware`, () => {

    const friendId = 'abc'

    test('that non existing friendId goes to next middleware', () => {
        const request: any = { body: { friendId } }
        const response: any = { locals: { user: { friends: [] } } }
        const next = jest.fn()

        const ERROR_MESSAGE = 'friend already exists'
        const middleware = getFriendAlreadyExistsMiddleware(ERROR_MESSAGE)
        middleware(request, response, next)

        expect.assertions(1)
        expect(next).toBeCalledWith()
    })

    test('that if friend already exists a 400 response with friend already exists message is sent', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = { body: { friendId } }
        const response: any = { locals: { user: { friends: [friendId] } }, status }
        const next = jest.fn()

        const ERROR_MESSAGE = 'friend already exists'
        const middleware = getFriendAlreadyExistsMiddleware(ERROR_MESSAGE)
        middleware(request, response, next)

        expect.assertions(3)

        expect(status).toBeCalledWith(400)
        expect(send).toBeCalledWith({ message: ERROR_MESSAGE })
        expect(next).not.toBeCalled()
    })
})

describe('addFriendMiddleware', () => {
    const mockUserId = '1234'
    const mockFriendId = '2345'

    test('that friendId gets added to the users friends array correctly', async () => {
        const findOneAndUpdate = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOneAndUpdate
        }
        const request = { body: { userId: mockUserId, friendId: mockFriendId } };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        const middleware = getAddFriendMiddleware(UserModel);

        await middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(2);
        expect(findOneAndUpdate).toBeCalledWith({ _id: mockUserId }, { $addToSet: { friends: mockFriendId } })
        expect(next).toBeCalledWith();
    })

    test("should call next() with err paramater if database call fails", async () => {
        const ERROR_MESSAGE = 'addFriendError'
        const findOneAndUpdate = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOneAndUpdate
        }
        const request: any = { body: { userId: mockUserId, friendId: mockFriendId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getAddFriendMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(2);
        expect(findOneAndUpdate).toBeCalledWith({ _id: mockUserId }, { $addToSet: { friends: mockFriendId } })
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
})

describe('retreiveFriendsDetailsMiddleware', () => {
    const friendId = 'abcd'

    test('that response.locals.friends is populated with friends details', async () => {
        expect.assertions(3)
        const friends = [friendId]
        const request: any = {}
        const response: any = { locals: { updatedUser: { friends } } }
        const next = jest.fn()

        const find = jest.fn(() => Promise.resolve(true))

        const userModel = {
            find
        }

        const middleware = getRetreiveFriendsDetailsMiddleware(userModel)
        await middleware(request, response, next)

        expect(find).toBeCalledWith({ _id: { $in: friends } })
        expect(response.locals.friends).toBe(true)
        expect(next).toBeCalledWith()

    })

    test('that response.locals.friends is populated with friends details', async () => {
        expect.assertions(2)
        const friends = [friendId]
        const request: any = {}
        const response: any = { locals: { updatedUser: { friends } } }
        const next = jest.fn()

        const ERROR_MESSAGE = 'error'
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE))

        const userModel = {
            find
        }

        const middleware = getRetreiveFriendsDetailsMiddleware(userModel)
        await middleware(request, response, next)

        expect(find).toBeCalledWith({ _id: { $in: friends } })
        expect(next).toBeCalledWith(ERROR_MESSAGE)

    })
})

describe('formatFriendsMiddleware', () => {
    test('that formatted friends have just a userName property', () => {
        expect.assertions(2)
        const userName = 'friend'
        const password = 'password'
        const email = 'secret@gmail.com'
        const friend = {
            userName,
            password,
            email
        }
        const friends = [friend]
        const request: any = {}
        const response: any = { locals: { friends } }
        const next = jest.fn()

        formatFriendsMiddleware(request, response, next)
        expect(next).toBeCalledWith()
        expect(response.locals.formattedFriends).toEqual([{ userName }])
    })

    test('that next is called with err message on err', () => {
        expect.assertions(1)
        const request: any = {}
        const response: any = { locals: {} }
        const next = jest.fn()

        formatFriendsMiddleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError(`Cannot read property 'map' of undefined`))
    })
})

describe('sendFriendAddedSuccessMessageMiddleware', () => {

    test('that response sends success message inside of object', () => {
        const successMessage = 'success'
        const send = jest.fn()
        const formattedFriends = [{ userName: 'abc' }]
        const response: any = { send, locals: { formattedFriends } };

        const request: any = {}
        const next = jest.fn();

        const middleware = getSendFriendAddedSuccessMessageMiddleware(successMessage)
        middleware(request, response, next);

        expect.assertions(2);
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith({ message: successMessage, friends: formattedFriends })
    })

    test('that next gets called with error on message send failure', () => {
        const ERROR_MESSAGE = 'error'
        const successMessage = 'success'
        const formattedFriends = [{ userName: 'abc' }]
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const response: any = { send, locals: { formattedFriends } };

        const request: any = {}
        const next = jest.fn();

        const middleware = getSendFriendAddedSuccessMessageMiddleware(successMessage)
        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })
})

describe('addFriendMiddlewares', () => {
    test('that middlewares are defined in the correct order', () => {
        expect.assertions(8)
        expect(addFriendMiddlewares[0]).toBe(addFriendValidationMiddleware)
        expect(addFriendMiddlewares[1]).toBe(retreiveUserMiddleware)
        expect(addFriendMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(addFriendMiddlewares[3]).toBe(friendAlreadyExistsMiddleware)
        expect(addFriendMiddlewares[4]).toBe(addFriendMiddleware)
        expect(addFriendMiddlewares[5]).toBe(retreiveFriendsDetailsMiddleware)
        expect(addFriendMiddlewares[6]).toBe(formatFriendsMiddleware)
        expect(addFriendMiddlewares[7]).toBe(sendFriendAddedSuccessMessageMiddleware)
    })

})