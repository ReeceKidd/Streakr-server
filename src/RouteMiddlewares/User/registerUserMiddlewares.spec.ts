/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    registerUserMiddlewares,
    userRegistrationValidationMiddleware,
    doesUserEmailExistMiddleware,
    getDoesUserEmailExistMiddleware,
    doesUsernameExistMiddleware,
    getDoesUsernameExistMiddleware,
    saveUserToDatabaseMiddleware,
    sendFormattedUserMiddleware,
    setUsernameToLowercaseMiddleware,
    getSaveUserToDatabaseMiddleware,
    formatUserMiddleware,
    getFormatUserMiddleware,
} from './registerUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';

describe(`userRegistrationValidationMiddleware`, () => {
    const mockUsername = 'mockUsername';
    const mockEmail = 'mock@gmail.com';

    test('check that valid request passes', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { username: mockUsername, email: mockEmail },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct correct response when username is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { email: mockEmail },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "username" fails because ["username" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when email is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { username: mockUsername },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when email is incorrect', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const incorrectEmail = '1234';
        const request: any = {
            body: {
                username: mockUsername,
                email: incorrectEmail,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" must be a valid email]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when invalid paramter is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const notAllowed = '123';
        const request: any = {
            body: {
                notAllowed,
                username: mockUsername,
                email: mockEmail,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
        expect(next).not.toBeCalled();
    });
});

describe(`doesUserEmailExistMiddleware`, () => {
    const mockEmail = 'test@gmail.com';
    const ERROR_MESSAGE = 'error';

    test('calls next() if email does not exist', async () => {
        expect.assertions(2);
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne,
        };
        const request: any = { body: { email: mockEmail } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(next).toBeCalledWith();
    });

    test('throws UserEmailAlreadyExists if user is found', async () => {
        expect.assertions(1);
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne,
        };
        const request: any = { body: { email: mockEmail } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UserEmailAlreadyExists));
    });

    test('calls next with DoesUserEmailExistMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne,
        };
        const request: any = { body: { email: mockEmail } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DoesUserEmailExistMiddleware, expect.any(Error)));
    });
});

describe('setUsernameToLowercaseMiddleware', () => {
    const mockUsername = 'Test-Name';
    const mockLowerCaseUsername = 'test-name';

    test('sets username to lowercase version of itself', () => {
        expect.assertions(2);
        const request: any = { body: { username: mockUsername } };
        const response: any = { locals: {} };
        const next = jest.fn();

        setUsernameToLowercaseMiddleware(request, response, next);

        expect(response.locals.lowerCaseUsername).toBe(mockLowerCaseUsername);
        expect(next).toBeCalledWith();
    });

    test('calls next with SetUsernameToLowercaseMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {
            body: {
                username: {
                    toLowerCase: () => {
                        throw new Error();
                    },
                },
            },
        };
        const response: any = {};
        const next = jest.fn();

        setUsernameToLowercaseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SetUsernameToLowercaseMiddleware, expect.any(Error)));
    });
});

describe(`doesUsernameExistMiddleware`, () => {
    const mockUsername = 'testname';
    const ERROR_MESSAGE = 'error';

    test('calls next() when username does not exist', async () => {
        expect.assertions(2);
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne,
        };
        const request: any = {};
        const response: any = { locals: { lowerCaseUsername: mockUsername } };
        const next = jest.fn();
        const middleware = getDoesUsernameExistMiddleware(UserModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ username: mockUsername });
        expect(next).toBeCalledWith();
    });

    test('throws UsernameAlreadyExists error when user already exists', async () => {
        expect.assertions(2);
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne,
        };
        const request: any = {};
        const response: any = { locals: { lowerCaseUsername: mockUsername } };
        const next = jest.fn();
        const middleware = getDoesUsernameExistMiddleware(UserModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ username: mockUsername });
        expect(next).toBeCalledWith(new CustomError(ErrorType.UsernameAlreadyExists, expect.any(Error)));
    });

    test('calls next with DoesUsernameAlreadyExistMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne,
        };
        const request: any = { body: {} };
        const response: any = { locals: { lowerCaseUsername: mockUsername } };
        const next = jest.fn();
        const middleware = getDoesUsernameExistMiddleware(UserModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DoesUsernameAlreadyExistMiddleware, expect.any(Error)));
    });
});

describe(`saveUserToDatabaseMiddleware`, () => {
    test('sets response.locals.savedUser', async () => {
        expect.assertions(2);
        const timezone = 'Europe/London';
        const username = 'user';
        const email = 'user@gmail.com';
        const save = jest.fn(() => {
            return Promise.resolve(true);
        });
        class User {
            username: string;
            email: string;
            timezone: string;

            constructor({ username, email, timezone }: any) {
                this.username = username;
                this.email = email;
                this.timezone = timezone;
            }

            save() {
                return save();
            }
        }
        const response: any = {
            locals: { timezone, lowerCaseUsername: username },
        };
        const request: any = { body: { email } };
        const next = jest.fn();
        const middleware = getSaveUserToDatabaseMiddleware(User as any);

        await middleware(request, response, next);

        expect(response.locals.savedUser).toBeDefined();
        expect(save).toBeCalledWith();
    });

    test('calls next with SaveUserToDatabaseMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getSaveUserToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveUserToDatabaseMiddleware, expect.any(Error)));
    });
});

describe('formatUserMiddleware', () => {
    test('populates response.locals.formattedUser with a formattedUser', () => {
        expect.assertions(3);
        const request: any = {};

        const savedUser = getMockUser({ _id: 'abc' });
        const response: any = { locals: { savedUser, following: [], followers: [], achievements: [] } };
        const next = jest.fn();

        const getPopulatedCurrentUserFunction = jest.fn(() => true);

        const middleware = getFormatUserMiddleware(getPopulatedCurrentUserFunction as any);

        middleware(request, response, next);

        expect(getPopulatedCurrentUserFunction).toBeCalledWith({
            user: savedUser,
            following: [],
            followers: [],
            achievements: [],
        });
        expect(response.locals.formattedUser).toBeDefined();
        expect(next).toBeCalled();
    });

    test('calls next with GetCurrentUserFormatUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getFormatUserMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedUserMiddleware`, () => {
    test('sends formattedUser in request', () => {
        expect.assertions(3);
        const mockUsername = 'abc';
        const mockEmail = 'email@gmail.com';
        const formattedUser = {
            username: mockUsername,
            email: mockEmail,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { formattedUser }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedUserMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(formattedUser);
    });

    test('calls next with SendFormattedUserMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendFormattedUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedUserMiddleware));
    });
});

describe(`registerUserMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(8);

        expect(registerUserMiddlewares.length).toEqual(7);
        expect(registerUserMiddlewares[0]).toBe(userRegistrationValidationMiddleware);
        expect(registerUserMiddlewares[1]).toBe(doesUserEmailExistMiddleware);
        expect(registerUserMiddlewares[2]).toBe(setUsernameToLowercaseMiddleware);
        expect(registerUserMiddlewares[3]).toBe(doesUsernameExistMiddleware);
        expect(registerUserMiddlewares[4]).toBe(saveUserToDatabaseMiddleware);
        expect(registerUserMiddlewares[5]).toBe(formatUserMiddleware);
        expect(registerUserMiddlewares[6]).toBe(sendFormattedUserMiddleware);
    });
});
