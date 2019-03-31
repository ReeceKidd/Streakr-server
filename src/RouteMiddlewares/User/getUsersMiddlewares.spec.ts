import { getUsersMiddlewares, retreiveUsersValidationMiddleware, retreiveUsersByUsernameRegexSearchMiddleware, formatUsersMiddleware, sendUsersMiddleware, maximumSearchQueryLength, getRetreiveUsersByUsernameRegexSearchMiddleware } from "./getUsersMiddlewares";
import { IUser } from "Models/User";

describe(`getUsersValidationMiddleware`, () => {

    const mockSearchQuery = 'searchQuery'

    test("check that valid request passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { searchQuery: mockSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        retreiveUsersValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith();
    });

    test("check that correct response is sent when searchQuery is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        retreiveUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that correct response is sent when searchQuery is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        retreiveUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that correct response is sent when searchQuery length is too short", () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const shortSearchQuery = ""

        const request: any = {
            body: { searchQuery: shortSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        retreiveUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is not allowed to be empty]'
        });
        expect(next).not.toBeCalled();
    })

    test(`check that correct response is sent when searchQuery length is longer than ${maximumSearchQueryLength}`, () => {

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const longSearchQuery = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

        const request: any = {
            body: { searchQuery: longSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        retreiveUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" length must be less than or equal to 64 characters long]'
        });
        expect(next).not.toBeCalled();
    })

    test(`check that correct response is sent when searchQuery is not a string`, () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const numberSearchQuery = 123

        const request: any = {
            body: { searchQuery: numberSearchQuery }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        retreiveUsersValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" must be a string]'
        });
        expect(next).not.toBeCalled();
    })

});

describe('getUsersByUsernameRegexSearchMiddleware', () => {
    test('that response.locals.users is populated and next is called', async () => {
        const mockSearchQuery = 'searchQuery'
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const find = jest.fn(() => Promise.resolve(true))
        const userModel = { find }

        const request: any = {
            body: { searchQuery: mockSearchQuery }
        };
        const response: any = {
            status, locals: {}
        };
        const next = jest.fn();

        const middleware = getRetreiveUsersByUsernameRegexSearchMiddleware(userModel)

        await middleware(request, response, next)

        expect.assertions(3);
        expect(find).toBeCalledWith({ userName: { $regex: mockSearchQuery } })
        expect(response.locals.users).toBeDefined()
        expect(next).toBeCalledWith();

    })

    test('that next is called with err on failure', async () => {
        const mockSearchQuery = 'searchQuery'
        const errorMessage = 'error'
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const find = jest.fn(() => Promise.reject(errorMessage))
        const userModel = { find }

        const request: any = {
            body: { searchQuery: mockSearchQuery }
        };
        const response: any = {
            status, locals: {}
        };
        const next = jest.fn();

        const middleware = getRetreiveUsersByUsernameRegexSearchMiddleware(userModel)

        await middleware(request, response, next)

        expect.assertions(2);
        expect(response.locals.users).not.toBeDefined()
        expect(next).toBeCalledWith(errorMessage);
    })
})

describe('formatUsersMiddleware', () => {
    test('checks that response.locals.formattedUsers contains a correctly formatted user', () => {
        expect.assertions(2);

        const mockUser = {
            _id: '1234',
            userName: 'test',
            email: 'test@test.com',
            password: '12345678',
            createdAt: new Date(),
            modifiedAt: new Date(),
            role: 'Admin',
            preferredLanguage: 'English'
        } as IUser

        const request: any = {};
        const response: any = { locals: { users: [mockUser] } };
        const next = jest.fn();

        formatUsersMiddleware(request, response, next);

        const formattedUser = {
            ...mockUser,
            password: undefined
        }

        expect(response.locals.formattedUsers[0]).toEqual({
            ...formattedUser
        })
        expect(next).toBeCalledWith();
    })

    test('checks that errors are passed into the next middleware', () => {
        expect.assertions(2);

        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();

        formatUsersMiddleware(request, response, next);

        expect(response.locals.formattedUsers).toBe(undefined)
        expect(next).toBeCalledWith(new TypeError(`Cannot read property 'map' of undefined`))
    })
})


describe(`getUsersMiddlewares`, () => {
    test("that getUsersMiddlewares are defined in the correct order", () => {
        expect.assertions(4);
        expect(getUsersMiddlewares[0]).toBe(retreiveUsersValidationMiddleware)
        expect(getUsersMiddlewares[1]).toBe(retreiveUsersByUsernameRegexSearchMiddleware)
        expect(getUsersMiddlewares[2]).toBe(formatUsersMiddleware)
        expect(getUsersMiddlewares[3]).toBe(sendUsersMiddleware)
    });
});