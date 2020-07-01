/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';
import {
    temporaryUserRegistrationValidationMiddleware,
    saveTemporaryUserToDatabaseMiddleware,
    getSaveTemporaryUserToDatabaseMiddleware,
    formatTemporaryUserMiddleware,
    sendFormattedTemporaryUserMiddleware,
    registerWithUserIdentifierMiddlewares,
    doesUserIdentifierExistMiddleware,
    getDoesUserIdentifierExistMiddleware,
    generateRandomUsernameMiddleware,
    getGenerateRandomUsernameMiddleware,
    getGenerateTemporaryPasswordMiddleware,
    generateTemporaryPasswordMiddleware,
    getFormatTemporaryUserMiddleware,
    awsCognitoSignUpMiddleware,
    getAwsCognitoSignUpMiddleware,
} from './registerWithUserIdentifierMiddlewares';

describe(`registerWithUserIdentifierMiddlewares`, () => {
    describe(`temporaryUserRegistrationValidationMiddleware`, () => {
        const userIdentifier = 'userIdentifier';

        test('check that valid request passes', () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { userIdentifier },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            temporaryUserRegistrationValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });

        test('sends correct correct response when userIdentifier is missing', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {},
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            temporaryUserRegistrationValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userIdentifier" fails because ["userIdentifier" is required]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe(`doesUserEmailExistMiddleware`, () => {
        test('calls next() if user does not exist', async () => {
            expect.assertions(2);
            const userIdentifier = 'userIdentifier';
            const findOne = jest.fn(() => Promise.resolve(false));
            const UserModel = {
                findOne,
            };
            const request: any = { body: { userIdentifier } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDoesUserIdentifierExistMiddleware(UserModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ userIdentifier });
            expect(next).toBeCalledWith();
        });

        test('throws UserIdentifierExists if userIdentifier is found', async () => {
            expect.assertions(1);
            const userIdentifier = 'userIdentifier';
            const findOne = jest.fn(() => Promise.resolve(true));
            const UserModel = {
                findOne,
            };
            const request: any = { body: { userIdentifier } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDoesUserIdentifierExistMiddleware(UserModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UserIdentifierExists));
        });

        test('calls next with DoesUserEmailExistMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDoesUserIdentifierExistMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DoesUserIdentifierExistMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`generateRandomUsernameMiddleware`, () => {
        test('calls generateRandomUsername and stores it on response.locals.randomUsername', async () => {
            expect.assertions(3);
            const userIdentifier = 'userIdentifier';
            const generateRandomUsername = jest.fn(() => Promise.resolve(false));
            const request: any = { body: { userIdentifier } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getGenerateRandomUsernameMiddleware(generateRandomUsername as any);

            await middleware(request, response, next);

            expect(generateRandomUsername).toBeCalledWith();
            expect(response.locals.randomUsername).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with GenerateRandomUsernameMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getGenerateRandomUsernameMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.GenerateRandomUsernameMiddleware, expect.any(Error)));
        });
    });

    describe(`generateTemporaryPasswordMiddleware`, () => {
        test('calls getTemporaryPassword and stores it on response.locals.temporaryPassword', async () => {
            expect.assertions(3);
            const userIdentifier = 'userIdentifier';
            const getTemporaryPassword = jest.fn(() => Promise.resolve(false));
            const request: any = { body: { userIdentifier } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getGenerateTemporaryPasswordMiddleware(getTemporaryPassword as any);

            await middleware(request, response, next);

            expect(getTemporaryPassword).toBeCalledWith();
            expect(response.locals.temporaryPassword).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with GenerateRandomUsernameMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getGenerateTemporaryPasswordMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.GenerateTemporaryPasswordMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`awsCognitoSignUpMiddleware`, () => {
        test('calls signUp functions', async () => {
            expect.assertions(2);
            const userIdentifier = 'userIdentifier';
            const awsCognitoSignUp = jest.fn(() => Promise.resolve(false));
            const request: any = { body: { userIdentifier } };
            const randomUsername = 'username';
            const temporaryPassword = '123456';
            const response: any = { locals: { randomUsername, temporaryPassword } };
            const next = jest.fn();
            const middleware = getAwsCognitoSignUpMiddleware(awsCognitoSignUp as any);

            await middleware(request, response, next);

            expect(awsCognitoSignUp).toBeCalledWith({ username: randomUsername, password: temporaryPassword });
            expect(next).toBeCalledWith();
        });

        test('calls next with AwsCognitoSignUpMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getAwsCognitoSignUpMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.AwsCognitoSignUpMiddleware, expect.any(Error)));
        });
    });

    describe(`saveTemporaryUserToDatabaseMiddleware`, () => {
        test('sets response.locals.savedUser', async () => {
            expect.assertions(2);
            const userIdentifier = 'userIdentifier';
            const createUser = jest.fn(() => {
                return Promise.resolve(true);
            });

            const timezone = 'Europe/London';
            const randomUsername = 'username';
            const response: any = {
                locals: { timezone, randomUsername },
            };
            const request: any = { body: { userIdentifier } };
            const next = jest.fn();
            const middleware = getSaveTemporaryUserToDatabaseMiddleware(createUser as any);

            await middleware(request, response, next);

            expect(createUser).toBeCalledWith({
                userIdentifier,
                timezone,
                username: randomUsername,
            });
            expect(response.locals.savedUser).toBeDefined();
        });

        test('calls next with SaveTemporaryUserToDatabaseMiddleware error on middleware failure', () => {
            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getSaveTemporaryUserToDatabaseMiddleware({} as any);

            middleware(request, response, next);

            expect.assertions(1);
            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SaveTemporaryUserToDatabaseMiddleware, expect.any(Error)),
            );
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

            const middleware = getFormatTemporaryUserMiddleware(getPopulatedCurrentUserFunction as any);

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

            const middleware = getFormatTemporaryUserMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, expect.any(Error)),
            );
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

            sendFormattedTemporaryUserMiddleware(request, response, next);

            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(formattedUser);
        });

        test('calls next with SendFormattedUserMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendFormattedTemporaryUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedUserMiddleware));
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(9);

        expect(registerWithUserIdentifierMiddlewares.length).toEqual(8);
        expect(registerWithUserIdentifierMiddlewares[0]).toBe(temporaryUserRegistrationValidationMiddleware);
        expect(registerWithUserIdentifierMiddlewares[1]).toBe(doesUserIdentifierExistMiddleware);
        expect(registerWithUserIdentifierMiddlewares[2]).toBe(generateRandomUsernameMiddleware);
        expect(registerWithUserIdentifierMiddlewares[3]).toBe(generateTemporaryPasswordMiddleware);
        expect(registerWithUserIdentifierMiddlewares[4]).toBe(awsCognitoSignUpMiddleware);
        expect(registerWithUserIdentifierMiddlewares[5]).toBe(saveTemporaryUserToDatabaseMiddleware);
        expect(registerWithUserIdentifierMiddlewares[6]).toBe(formatTemporaryUserMiddleware);
        expect(registerWithUserIdentifierMiddlewares[7]).toBe(sendFormattedTemporaryUserMiddleware);
    });
});
