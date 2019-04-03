import { Request, Response, NextFunction } from 'express'

import { addFriendMiddlewares, addFriendValidationMiddleware, retreiveUserMiddleware, userExistsValidationMiddleware, getAddFriendMiddleware, addFriendMiddleware, sendSuccessMessageMiddleware, getRetreiveUserMiddleware, getUserExistsValidationMiddleware } from "./addFriendMiddlewares";

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

describe('addFriendMiddleware', () => {
    const mockUserId = '1234'
    const mockFriendId = '2345'

    test('that friendId gets added to the users friends array correctly', async () => {
        const findOneAndUpdate = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOneAndUpdate
        }
        const request = {};
        const response: any = {
            locals: { userId: mockUserId, friendId: mockFriendId },
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
        const request: any = {};
        const response: any = { locals: { userId: mockUserId, friendId: mockFriendId } };
        const next = jest.fn();

        const middleware = getAddFriendMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(2);
        expect(findOneAndUpdate).toBeCalledWith({ _id: mockUserId }, { $addToSet: { friends: mockFriendId } })
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
})

describe('addFriendMiddlewares', () => {
    test('that middlewares are defined in the correct order', () => {
        expect.assertions(5)
        expect(addFriendMiddlewares[0]).toBe(addFriendValidationMiddleware)
        expect(addFriendMiddlewares[1]).toBe(retreiveUserMiddleware)
        expect(addFriendMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(addFriendMiddlewares[3]).toBe(addFriendMiddleware)
        expect(addFriendMiddlewares[4]).toBe(sendSuccessMessageMiddleware)
    })

})