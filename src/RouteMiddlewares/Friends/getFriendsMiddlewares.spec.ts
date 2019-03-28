import { getFriendsMiddlewares, getFriendsValidationMiddleware, formatFriendsMiddleware, userExistsValidationMiddleware, retreiveFriendsMiddleware, sendFormattedFriendsMiddleware, getRetreiveUserMiddleware, retreiveUserMiddleware } from "./getFriendsMiddlewares";

describe(`getFriendsValidationMiddleware`, () => {

    test("check that valid request passes", () => {
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

        expect.assertions(1);
        expect(next).toBeCalled();
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
        const findOne = jest.fn(() => Promise.resolve(true));
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

    test("should send error response when user doesn't exist", async () => {
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
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
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