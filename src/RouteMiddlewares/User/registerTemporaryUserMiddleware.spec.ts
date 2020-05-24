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
    registerTemporaryUserMiddlewares,
} from './registerTemporaryUserMiddleware';

describe(`registerTemporaryUserMiddlewares`, () => {
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

    describe(`saveTemporaryUserToDatabaseMiddleware`, () => {
        test('sets response.locals.savedUser', async () => {
            expect.assertions(2);
            const userIdentifier = 'userIdentifier';
            const save = jest.fn(() => {
                return Promise.resolve(true);
            });
            class User {
                userIdentifier: string;

                constructor({ userIdentifier }: any) {
                    this.userIdentifier = userIdentifier;
                }

                save() {
                    return save();
                }
            }
            const response: any = {
                locals: {},
            };
            const request: any = { body: { userIdentifier } };
            const next = jest.fn();
            const middleware = getSaveTemporaryUserToDatabaseMiddleware(User as any);

            await middleware(request, response, next);

            expect(response.locals.savedUser).toBeDefined();
            expect(save).toBeCalledWith();
        });

        test('calls next with SaveUserToDatabaseMiddleware error on middleware failure', () => {
            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getSaveTemporaryUserToDatabaseMiddleware({} as any);

            middleware(request, response, next);

            expect.assertions(1);
            expect(next).toBeCalledWith(new CustomError(ErrorType.SaveUserToDatabaseMiddleware, expect.any(Error)));
        });
    });

    describe('formatTemporaryUserMiddleware', () => {
        test('populates response.locals.user with a formattedUser', () => {
            expect.assertions(2);
            const request: any = {};
            const savedUser = getMockUser();
            const response: any = { locals: { savedUser } };
            const next = jest.fn();

            formatTemporaryUserMiddleware(request, response, next);

            expect(next).toBeCalled();
            expect(Object.keys(response.locals.user).sort()).toEqual(
                [
                    '_id',
                    'email',
                    'username',
                    'membershipInformation',
                    'userType',
                    'followers',
                    'following',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    'pushNotification',
                    'pushNotifications',
                    'hasCompletedTutorial',
                    'hasCompletedIntroduction',
                    'onboarding',
                    'hasCompletedOnboarding',
                    'profileImages',
                    'achievements',
                    'totalStreakCompletes',
                    'totalLiveStreaks',
                ].sort(),
            );
        });

        test('calls next with RegisterUserFormatUserMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            formatTemporaryUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RegisterUserFormatUserMiddleware, expect.any(Error)));
        });
    });

    describe(`sendFormattedUserMiddleware`, () => {
        test('sends savedUser in request', () => {
            expect.assertions(3);
            const mockUsername = 'abc';
            const mockEmail = 'email@gmail.com';
            const user = {
                username: mockUsername,
                email: mockEmail,
            };
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const response: any = { locals: { user }, status };
            const request: any = {};
            const next = jest.fn();

            sendFormattedTemporaryUserMiddleware(request, response, next);

            expect(next).toBeCalled();
            expect(status).toBeCalledWith(ResponseCodes.created);
            expect(send).toBeCalledWith(user);
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
        expect.assertions(5);

        expect(registerTemporaryUserMiddlewares.length).toEqual(4);
        expect(registerTemporaryUserMiddlewares[0]).toBe(temporaryUserRegistrationValidationMiddleware);
        expect(registerTemporaryUserMiddlewares[1]).toBe(saveTemporaryUserToDatabaseMiddleware);
        expect(registerTemporaryUserMiddlewares[2]).toBe(formatTemporaryUserMiddleware);
        expect(registerTemporaryUserMiddlewares[3]).toBe(sendFormattedTemporaryUserMiddleware);
    });
});
