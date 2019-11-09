/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    userRequestBodyValidationMiddleware,
    getPatchCurrentUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
    patchCurrentUserMiddlewares,
    patchCurrentUserMiddleware,
} from './patchCurrentUserMiddlewares';
import { sendUpdatedUserMiddleware } from './patchUserMiddlewares';

describe('userRequestBodyValidationMiddleware', () => {
    test('sends correct error response when unsupported key is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { unsupportedKey: 'unsupportedKey' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response is sent when timezone is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { timezone: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "timezone" fails because ["timezone" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchCurrentUserMiddleware', () => {
    test('sets response.locals.updatedUser', async () => {
        expect.assertions(3);
        const user = {
            _id: '_id',
        };
        const timezone = 'Europe/London';
        const request: any = {
            body: {
                timezone,
            },
        };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchCurrentUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(user._id, { timezone }, { new: true });
        expect(response.locals.updatedUser).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedCurrentUserNotFound error when user is not found', async () => {
        expect.assertions(1);
        const user = {
            _id: '_id',
        };
        const request: any = {
            body: {
                timezone: 'Europe/London',
            },
        };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(false);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchCurrentUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdateCurrentUserNotFound));
    });

    test('calls next with PatchCurrentUserMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getPatchCurrentUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchCurrentUserMiddleware));
    });
});

describe('sendUpdatedCurrentUserMiddleware', () => {
    test('sends updatedUser', () => {
        expect.assertions(3);
        const updatedTimezone = 'Europe/Paris';
        const formattedUser = {
            userId: 'abc',
            timezone: updatedTimezone,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userResponseLocals = { formattedUser };
        const response: any = { locals: userResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedCurrentUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(formattedUser);
    });

    test('calls next with SendUpdatedCurrentUserMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendUpdatedUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware, expect.any(Error)));
    });
});

describe('patchUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(patchCurrentUserMiddlewares.length).toBe(3);
        expect(patchCurrentUserMiddlewares[0]).toBe(userRequestBodyValidationMiddleware);
        expect(patchCurrentUserMiddlewares[1]).toBe(patchCurrentUserMiddleware);
        expect(patchCurrentUserMiddlewares[2]).toBe(sendUpdatedCurrentUserMiddleware);
    });
});
