import { addFriendMiddlewares, addFriendValidationMiddleware, retreiveUserMiddleware, userExistsValidationMiddleware, addFriendMiddleware, sendSuccessMessageMiddleware } from "./addFriendMiddlewares";

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