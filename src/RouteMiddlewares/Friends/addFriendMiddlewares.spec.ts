import { Request, Response, NextFunction } from 'express'

import { addFriendMiddlewares, addFriendBodyValidationMiddleware, retreiveUserMiddleware, userExistsValidationMiddleware, getAddFriendMiddleware, addFriendMiddleware, getRetreiveUserMiddleware, getUserExistsValidationMiddleware, sendFriendAddedSuccessMessageMiddleware, getSendFriendAddedSuccessMessageMiddleware, getRetreiveFriendsDetailsMiddleware, retreiveFriendsDetailsMiddleware, formatFriendsMiddleware, setLocationHeaderMiddleware, getSetLocationHeaderMiddleware, addFriendParamsValidationMiddleware, defineLocationPathMiddleware, getDefineLocationPathMiddleware } from "./addFriendMiddlewares";
import { ResponseCodes } from '../../Server/responseCodes';
import { SupportedResponseHeaders } from '../../Server/headers';

describe('addFriendParamsValidationMiddleware', () => {

    const userId = 'abc'

    test('that valid request passes', () => {

        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            params: { userId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    })

    test('that request fails when userId is missing', () => {
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

        addFriendParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();

    })

})

describe('addFriendBodyValidationMiddleware', () => {

    const mockFriendId = '2345'

    test('that valid request passes', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { friendId: mockFriendId }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendBodyValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith();

    })

    test('that request fails when friendId is missing from body', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendBodyValidationMiddleware(request, response, next);

        expect.assertions(3)
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "friendId" fails because ["friendId" is required]'
        });
        expect(next).not.toBeCalled();

    })

    test('that request fails when friendId is not a string', () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { friendId: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        addFriendBodyValidationMiddleware(request, response, next);

        expect.assertions(3)
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
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
        const findOne = jest.fn(() => (Promise.resolve(true)));
        const UserModel = {
            findOne
        }
        const request: any = { params: { userId: mockUserId } };
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
        const request: any = { params: { userId: mockUserId } };
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
        const findOne = jest.fn(() => (Promise.reject(ERROR_MESSAGE)));
        const UserModel = {
            findOne
        }
        const request: any = { params: { userId: mockUserId } };
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
        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
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

describe('addFriendMiddleware', () => {
    const mockUserId = '1234'
    const mockFriendId = '2345'

    test('that friendId gets added to the users friends array correctly', async () => {
        const findOneAndUpdate = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOneAndUpdate
        }
        const request = {
            body: { friendId: mockFriendId },
            params: { userId: mockUserId }
        };
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
        expect.assertions(2);
        const ERROR_MESSAGE = 'addFriendError'
        const findOneAndUpdate = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOneAndUpdate
        }
        const request: any = {
            body: { friendId: mockFriendId },
            params: { userId: mockUserId }
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getAddFriendMiddleware(UserModel);

        await middleware(request, response, next);

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

describe('defineLocationPathMiddleware', () => {
    test('that response.locals.locationPath is defined correctly', () => {
        expect.assertions(2);
        const userId = '123'
        const friendId = 'abc'
        const request: any = {
            params: { userId },
            body: { friendId }
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        const apiVersion = 'v1'
        const userCategory = 'users'
        const friendsProperty = 'friends'
        const middleware = getDefineLocationPathMiddleware(apiVersion, userCategory, friendsProperty)
        middleware(request, response, next);

        expect(response.locals.locationPath).toEqual(`/${apiVersion}/${userCategory}/${userId}/${friendsProperty}/${friendId}`)
        expect(next).toBeCalledWith();
    })


    test("that next is called with error on failure", () => {
        expect.assertions(1)
        const userId = '123'
        const friendId = 'abc'
        const request: any = {
            params: { userId },
            body: { friendId }
        };
        const response: any = {
        };
        const next = jest.fn();

        const apiVersion = 'v1'
        const userCategory = 'users'
        const friendsProperty = 'friends'
        const middleware = getDefineLocationPathMiddleware(apiVersion, userCategory, friendsProperty)
        middleware(request, response, next);
        expect(next).toBeCalledWith(new TypeError(`Cannot set property 'locationPath' of undefined`));
    });
})

describe('setLocationHeaderMiddleware', () => {
    test('that location header is set correctly', () => {
        const locationPath = 'v1/users/123/friends/abc'
        const request: any = {
            body: { friendId: '1234' }
        };
        const setHeader = jest.fn()
        const response: any = {
            setHeader,
            locals: {
                locationPath
            }
        };
        const next = jest.fn();


        const middleware = getSetLocationHeaderMiddleware(SupportedResponseHeaders.location)
        middleware(request, response, next);

        expect.assertions(2);
        expect(setHeader).toHaveBeenCalledWith(SupportedResponseHeaders.location, locationPath)
        expect(next).toBeCalled();
    })

    test("that next is called with error on failure", () => {
        const request: any = {
            body: { friendId: '1234' }
        };
        const response: any = {
        };
        const next = jest.fn();

        const middleware = getSetLocationHeaderMiddleware(SupportedResponseHeaders.location)

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `locationPath` of 'undefined' or 'null'."));
    });
})

describe('sendFriendAddedSuccessMessageMiddleware', () => {

    test('that response sends success message inside of object', () => {
        const successMessage = 'success'
        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const formattedFriends = [{ userName: 'abc' }]
        const response: any = { status, locals: { formattedFriends } };

        const request: any = {}
        const next = jest.fn();

        const middleware = getSendFriendAddedSuccessMessageMiddleware(successMessage)
        middleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled()
        expect(status).toBeCalledWith(ResponseCodes.created)
        expect(send).toBeCalledWith({ message: successMessage, friends: formattedFriends })
    })

    test('that next gets called with error on message send failure', () => {
        const ERROR_MESSAGE = 'error'
        const successMessage = 'success'
        const formattedFriends = [{ userName: 'abc' }]
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const status = jest.fn(() => ({ send }))
        const response: any = { status, locals: { formattedFriends } };

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
        expect.assertions(10)
        expect(addFriendMiddlewares[0]).toBe(addFriendParamsValidationMiddleware)
        expect(addFriendMiddlewares[1]).toBe(addFriendBodyValidationMiddleware)
        expect(addFriendMiddlewares[2]).toBe(retreiveUserMiddleware)
        expect(addFriendMiddlewares[3]).toBe(userExistsValidationMiddleware)
        expect(addFriendMiddlewares[4]).toBe(addFriendMiddleware)
        expect(addFriendMiddlewares[5]).toBe(retreiveFriendsDetailsMiddleware)
        expect(addFriendMiddlewares[6]).toBe(formatFriendsMiddleware)
        expect(addFriendMiddlewares[7]).toBe(defineLocationPathMiddleware)
        expect(addFriendMiddlewares[8]).toBe(setLocationHeaderMiddleware)
        expect(addFriendMiddlewares[9]).toBe(sendFriendAddedSuccessMessageMiddleware)
    })

})