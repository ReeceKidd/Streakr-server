/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchSoloStreakMiddlewares,
    soloStreakRequestBodyValidationMiddleware,
    getPatchSoloStreakMiddleware,
    patchSoloStreakMiddleware,
    sendUpdatedSoloStreakMiddleware,
    soloStreakParamsValidationMiddleware,
    createArchivedSoloStreakActivityFeedItemMiddleware,
    getCreateArchivedSoloStreakActivityFeedItemMiddleware,
    getCreateRestoredSoloStreakActivityFeedItemMiddleware,
    createRestoredSoloStreakActivityFeedItemMiddleware,
    createDeletedSoloStreakActivityFeedItemMiddleware,
    getCreateDeletedSoloStreakActivityFeedItemMiddleware,
    getCreateEditedSoloStreakNameActivityFeedItemMiddleware,
    getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware,
    createEditedSoloStreakNameActivityFeedItemMiddleware,
    createEditedSoloStreakDescriptionActivityFeedItemMiddleware,
    disableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware,
    getDisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware,
} from './patchSoloStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakStatus, StreakReminderTypes } from '@streakoid/streakoid-models/lib';
import { CustomSoloStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/models/StreakReminders';

describe('soloStreakParamsValidationMiddleware', () => {
    test('sends correct error response when soloStreakId is not defined', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when soloStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { soloStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('soloStreakRequestBodyValidationMiddleware', () => {
    test('sends correct error response when unsupported key is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { unsupportedKey: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when streakName is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { streakName: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response is sent when streakDescription is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { streakDescription: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchSoloStreakMiddleware', () => {
    test('sets response.locals.updatedSoloStreak', async () => {
        expect.assertions(3);
        const soloStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const status = 'archived';
        const request: any = {
            params: { soloStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
                status,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            soloStreakId,
            { userId, streakName, streakDescription, status },
            { new: true },
        );
        expect(response.locals.updatedSoloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedSoloStreakNotFound error when solo streak is not found', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { soloStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedSoloStreakNotFound));
    });

    test('calls next with PatchSoloStreakMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { soloStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const errorMessage = 'error';
        const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchSoloStreakMiddleware));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedSoloStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('sends updatedSoloStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const soloStreakResponseLocals = { updatedSoloStreak };
        const response: any = { locals: soloStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedSoloStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedSoloStreak);
    });

    test('calls next with SendUpdatedSoloStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedSoloStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedSoloStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedSoloStreakMiddleware, expect.any(Error)));
    });
});

describe(`disableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware`, () => {
    test('disables current user customSoloStreakReminder for this solo streak if they had one.', async () => {
        expect.assertions(2);
        const _id = '_id';
        const updatedSoloStreak = { _id, streakName: 'Reading', members: ['memberId'] };
        const customSoloStreakReminder: CustomSoloStreakReminder = {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 21,
            reminderMinute: 0,
            streakReminderType: StreakReminderTypes.customSoloStreakReminder,
            soloStreakId: _id,
            soloStreakName: 'reading',
        };
        const customStreakReminders: CustomStreakReminder[] = [customSoloStreakReminder];
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const userModel = {
            findByIdAndUpdate,
        };
        const user = { pushNotifications: { customStreakReminders } };
        const response: any = { locals: { updatedSoloStreak, user } };
        const request: any = { body: { status: StreakStatus.archived } };
        const next = jest.fn();

        const middleware = getDisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal archived it just calls next', async () => {
        expect.assertions(2);
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const findById = jest.fn().mockResolvedValue(true);
        const userModel = {
            findById,
        };

        const response: any = { locals: { updatedSoloStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getDisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findById).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with DisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getDisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware, expect.any(Error)),
        );
    });
});

describe(`createArchivedSoloStreakActivityFeedItemMiddleware`, () => {
    test('creates a new archivedSoloStreak activity if request.body.status equals archived', async () => {
        expect.assertions(2);
        const user = { _id: '_id', username: 'username' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: { status: StreakStatus.archived } };
        const next = jest.fn();

        const middleware = getCreateArchivedSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal archived it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const soloStreakId = 'soloStreakId';
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user } };
        const request: any = { params: { soloStreakId }, body: {} };
        const next = jest.fn();

        const middleware = getCreateArchivedSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateArchivedSoloStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateArchivedSoloStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateArchivedSoloStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createRestoredSoloStreakActivityFeedItemMiddleware`, () => {
    test('creates a new restoredSoloStreak activity if request.body.status equals live', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: { status: StreakStatus.live } };
        const next = jest.fn();

        const middleware = getCreateRestoredSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal live it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateRestoredSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateRestoreSoloStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateRestoredSoloStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateRestoredSoloStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createDeletedSoloStreakActivityFeedItemMiddleware`, () => {
    test('creates a new deletedSoloStreak activity if request.body.status equals deleted', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: { status: StreakStatus.deleted } };
        const next = jest.fn();

        const middleware = getCreateDeletedSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.status does not equal deleted it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateDeletedSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateRestoreSoloStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateDeletedSoloStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateDeletedSoloStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createEditedSoloStreakNameActivityFeedItemMiddleware`, () => {
    test('creates a new editedSoloStreakName activity if request.body.streakName is defined', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: { streakName: 'new name' } };
        const next = jest.fn();

        const middleware = getCreateEditedSoloStreakNameActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.streakName is not defined it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateEditedSoloStreakNameActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateEditedSoloStreakNameActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateEditedSoloStreakNameActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateEditedSoloStreakNameActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createEditedSoloStreakDescriptionActivityFeedItemMiddleware`, () => {
    test('creates a new editedSoloStreakDescription activity if request.body.streakDescription is defined', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: { streakDescription: 'new description' } };
        const next = jest.fn();

        const middleware = getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware(
            createActivityFeedItem as any,
        );

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).toBeCalled();
    });

    test('if request.body.streakDescription is not defined it just calls next', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const updatedSoloStreak = { _id: '_id', streakName: 'Reading' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, updatedSoloStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware(
            createActivityFeedItem as any,
        );

        await middleware(request, response, next);

        expect(createActivityFeedItem).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with CreateEditedSoloStreakDescriptionActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateEditedSoloStreakDescriptionActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe('patchSoloStreakMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(11);

        expect(patchSoloStreakMiddlewares.length).toBe(10);
        expect(patchSoloStreakMiddlewares[0]).toBe(soloStreakParamsValidationMiddleware);
        expect(patchSoloStreakMiddlewares[1]).toBe(soloStreakRequestBodyValidationMiddleware);
        expect(patchSoloStreakMiddlewares[2]).toBe(patchSoloStreakMiddleware);
        expect(patchSoloStreakMiddlewares[3]).toBe(sendUpdatedSoloStreakMiddleware);
        expect(patchSoloStreakMiddlewares[4]).toBe(disableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware);
        expect(patchSoloStreakMiddlewares[5]).toBe(createArchivedSoloStreakActivityFeedItemMiddleware);
        expect(patchSoloStreakMiddlewares[6]).toBe(createRestoredSoloStreakActivityFeedItemMiddleware);
        expect(patchSoloStreakMiddlewares[7]).toBe(createDeletedSoloStreakActivityFeedItemMiddleware);
        expect(patchSoloStreakMiddlewares[8]).toBe(createEditedSoloStreakNameActivityFeedItemMiddleware);
        expect(patchSoloStreakMiddlewares[9]).toBe(createEditedSoloStreakDescriptionActivityFeedItemMiddleware);
    });
});
