/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllUsersMiddlewares,
    getUsersValidationMiddleware,
    maximumSearchQueryLength,
    sendUsersMiddleware,
    formatUsersMiddleware,
    formUsersQueryMiddleware,
    calculateTotalUsersCountMiddleware,
    findUsersMiddleware,
    getCalculateTotalUsersCountMiddleware,
    getFindUsersMiddleware,
} from './getAllUsersMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';

describe(`getUsersValidationMiddleware`, () => {
    const limit = 10;
    const skip = 10;
    const searchQuery = 'searchQuery';
    const username = 'username';
    const email = 'email@gmail.com';
    const userIds = ['user1', 'user2'];

    const query = {
        limit,
        skip,
        searchQuery,
        username,
        email,
        userIds,
    };

    test('valid request passes', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('sends correct response when limit is not a number', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: { limit: 'abc' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "limit" fails because ["limit" must be a number]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response when skip is not a number', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: { skip: 'abc' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "skip" fails because ["skip" must be a number]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response when searchQuery length is too short', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const shortSearchQuery = '';
        const request: any = {
            query: { searchQuery: shortSearchQuery },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is not allowed to be empty]',
        });
        expect(next).not.toBeCalled();
    });

    test(`sends correct response when searchQuery length is longer than ${maximumSearchQueryLength}`, () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const longSearchQuery =
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const request: any = {
            query: { searchQuery: longSearchQuery },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "searchQuery" fails because ["searchQuery" length must be less than or equal to 64 characters long]',
        });
        expect(next).not.toBeCalled();
    });

    test(`sends correct response when searchQuery is not a string`, () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const numberSearchQuery = 123;
        const request: any = {
            query: { searchQuery: numberSearchQuery },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test(`sends correct response when username is not a string`, () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: { username: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "username" fails because ["username" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test(`sends correct response when email is not an email`, () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: { email: 'not-an-email' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" must be a valid email]',
        });
        expect(next).not.toBeCalled();
    });

    test(`sends correct response when userIds is not an array`, () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: { userIds: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getUsersValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userIds" fails because ["userIds" must be an array]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('formUsersQueryMiddleware', () => {
    test('sets response.locals.query using the searchQuery', () => {
        expect.assertions(2);
        const searchQuery = 'searchQuery';
        const request: any = { query: { searchQuery } };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formUsersQueryMiddleware(request, response, next);

        expect(response.locals.query).toEqual({ username: { $regex: searchQuery.toLowerCase() } });
        expect(next).toBeCalledWith();
    });

    test('sets response.locals.query using the username', () => {
        expect.assertions(2);
        const username = 'username';
        const request: any = { query: { username } };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formUsersQueryMiddleware(request, response, next);

        expect(response.locals.query).toEqual({ username });
        expect(next).toBeCalledWith();
    });

    test('sets response.locals.query using the email', () => {
        expect.assertions(2);
        const email = 'email@gmail.com';
        const request: any = { query: { email } };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formUsersQueryMiddleware(request, response, next);

        expect(response.locals.query).toEqual({ email });
        expect(next).toBeCalledWith();
    });

    test('sets response.locals.query using userIds', () => {
        expect.assertions(2);
        const userIds = '{}';
        const request: any = { query: { userIds } };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formUsersQueryMiddleware(request, response, next);

        expect(response.locals.query).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('sets response.locals.query with an empty query', () => {
        expect.assertions(2);
        const request: any = { query: {} };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        formUsersQueryMiddleware(request, response, next);

        expect(response.locals.query).toEqual({});
        expect(next).toBeCalledWith();
    });

    test('calls next with FormUsersQueryMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        formUsersQueryMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormUsersQueryMiddleware, expect.any(Error)));
    });
});

describe('calculateTotalUsersCountMiddleware', () => {
    test('sets response.header.x-total-count with the total users count', async () => {
        expect.assertions(2);
        const query = {};
        const countDocuments = jest.fn().mockResolvedValue(10);
        const find = jest.fn(() => ({ countDocuments }));
        const userModel = { find };
        const setHeader = jest.fn();
        const request: any = {};
        const response: any = {
            setHeader,
            locals: { query },
        };
        const next = jest.fn();

        const middleware = getCalculateTotalUsersCountMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(setHeader).toBeCalledWith('x-total-count', 10);
        expect(next).toBeCalledWith();
    });

    test('calls next with CalculateTotalUsersCountMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCalculateTotalUsersCountMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CalculateTotalUsersCountMiddleware, expect.any(Error)));
    });
});

describe('findUsersMiddleware', () => {
    test('sets response.locals.users with the limited number of users', async () => {
        expect.assertions(7);
        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const limit = jest.fn(() => ({ lean }));
        const skip = jest.fn(() => ({ limit }));
        const sort = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({ sort }));
        const userModel = { find };
        const request: any = { query: { skip: 10, limit: 10 } };
        const response: any = {
            locals: { query: {} },
        };
        const next = jest.fn();

        const middleware = getFindUsersMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(sort).toBeCalledWith({ 'longestEverStreak.numberOfDays': -1 });
        expect(skip).toBeCalledWith(10);
        expect(limit).toBeCalledWith(10);
        expect(lean).toBeCalledWith();
        expect(response.locals.users).toEqual([{ username: 'username' }]);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindUsersMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindUsersMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindUsersMiddleware, expect.any(Error)));
    });
});

describe('formatUsersMiddleware', () => {
    test('formats each user in response.locals.users', () => {
        expect.assertions(3);
        const request: any = {};
        const user = getMockUser({ _id: 'abc' });
        const users = [user];
        const response: any = { locals: { users } };
        const next = jest.fn();

        formatUsersMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(response.locals.users[0].isPayingMember).toEqual(true);
        expect(Object.keys(response.locals.users[0]).sort()).toEqual(
            [
                '_id',
                'username',
                'isPayingMember',
                'userType',
                'timezone',
                'createdAt',
                'updatedAt',
                'profileImages',
                'pushNotification',
                'totalStreakCompletes',
            ].sort(),
        );
    });

    test('calls next with FormatUsersMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        formatUsersMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormatUsersMiddleware, expect.any(Error)));
    });
});

describe('sendUsersMiddleware', () => {
    test('sends users in response', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const users = ['user'];
        const request: any = {};
        const response: any = { locals: { users }, status };
        const next = jest.fn();

        sendUsersMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(users);
    });

    test('calls next with SendUsersMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendUsersMiddleware error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendUsersMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUsersMiddleware, expect.any(Error)));
    });
});

describe(`getAllUsersMiddlewares`, () => {
    test('that getAllUsersMiddlewares are defined in the correct order', () => {
        expect.assertions(7);

        expect(getAllUsersMiddlewares.length).toEqual(6);
        expect(getAllUsersMiddlewares[0]).toBe(getUsersValidationMiddleware);
        expect(getAllUsersMiddlewares[1]).toBe(formUsersQueryMiddleware);
        expect(getAllUsersMiddlewares[2]).toBe(calculateTotalUsersCountMiddleware);
        expect(getAllUsersMiddlewares[3]).toBe(findUsersMiddleware);
        expect(getAllUsersMiddlewares[4]).toBe(formatUsersMiddleware);
        expect(getAllUsersMiddlewares[5]).toBe(sendUsersMiddleware);
    });
});
