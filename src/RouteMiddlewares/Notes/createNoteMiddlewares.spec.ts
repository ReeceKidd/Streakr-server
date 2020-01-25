/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createNoteMiddlewares,
    createNoteBodyValidationMiddleware,
    createNoteFromRequestMiddleware,
    getCreateNoteFromRequestMiddleware,
    sendFormattedNoteMiddleware,
    notifiyTeamMembersThatUserHasAddedANoteMiddleware,
    getNotifyTeamMembersThatUserHasAddedANoteMiddleware,
} from './createNoteMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTypes } from '@streakoid/streakoid-sdk/lib';

const userId = '12345678';
const streakId = 'abcdefghijk';
const text = 'Completed Spanish lesson on Duolingo';
const streakType = StreakTypes.challenge;

describe(`createNoteBodyValidationMiddleware`, () => {
    const body = {
        userId,
        streakId,
        text,
        streakType,
    };

    test('valid request passes validation', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends userId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends userId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakId" fails because ["streakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakId" fails because ["streakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends text is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, text: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "text" fails because ["text" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakType is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakType: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakType" fails because ["streakType" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakType is not a valid streak type', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakType: 'individual' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createNoteBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "streakType" fails because ["streakType" must be one of [solo, team, teamMember, challenge]]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createNoteFromRequestMiddleware`, () => {
    test('sets response.locals.savedNote', async () => {
        expect.assertions(2);

        const save = jest.fn().mockResolvedValue(true);

        const note = jest.fn(() => ({ save }));

        const response: any = { locals: {} };
        const request: any = { body: { userId, streakId, streakType, note } };
        const next = jest.fn();

        const middleware = getCreateNoteFromRequestMiddleware(note as any);

        await middleware(request, response, next);

        expect(response.locals.savedNote).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateNoteFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateNoteFromRequestMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateNoteFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`notifyTeamMembersThatUserHasAddedANoteMiddleware`, () => {
    test('just calls next if streakType does not equal team', async () => {
        expect.assertions(1);

        const response: any = { locals: {} };
        const request: any = { body: { streakType: StreakTypes.solo } };
        const next = jest.fn();

        const middleware = getNotifyTeamMembersThatUserHasAddedANoteMiddleware({} as any, {} as any, {} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if streakType equals team but user does not have teamStreakUpdates enabled it does nothing', async () => {
        expect.assertions(3);
        const user = {
            _id: 'userId',
            username: 'username',
        };
        const populatedMember = {
            _id: 'populatedMemberId',
            memberId: 'teamMemberId',
            username: 'username',
            pushNotificationToken: 'pushNotificationToken',
            notifications: {
                teamStreakUpdates: {
                    pushNotification: false,
                },
            },
        };
        const teamStreak = {
            streakName: 'Daily Spanish',
            members: [populatedMember],
        };
        const teamMembers = [populatedMember];
        const sendPushNotificationsAsync = jest.fn().mockResolvedValue(['message']);
        const chunkPushNotifications = jest.fn().mockResolvedValue(['message']);
        const expo: any = { chunkPushNotifications, sendPushNotificationsAsync };
        const request: any = {
            body: {
                streakType: StreakTypes.team,
                text: 'Started reading a book',
                streakId: 'streakId',
            },
        };
        const response: any = {
            locals: {
                user,
                teamStreak,
                teamMembers,
            },
        };
        const next = jest.fn();
        const teamStreakModel = { findById: jest.fn().mockResolvedValue(teamStreak) };
        const userModel = { findById: jest.fn().mockResolvedValue(populatedMember) };

        const middleware = getNotifyTeamMembersThatUserHasAddedANoteMiddleware(
            expo as any,
            teamStreakModel as any,
            userModel as any,
        );
        await middleware(request, response, next);
        expect(sendPushNotificationsAsync).not.toBeCalled();
        expect(chunkPushNotifications).not.toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('if streakType equals team and user has teamStreakUpdates enabled it sends a push notification', async () => {
        expect.assertions(3);
        const user = {
            _id: 'userId',
            username: 'username',
        };
        const populatedMember = {
            _id: 'populatedMemberId',
            memberId: 'teamMemberId',
            username: 'username',
            pushNotificationToken: 'pushNotificationToken',
            notifications: {
                teamStreakUpdates: {
                    pushNotification: true,
                },
            },
        };
        const teamStreak = {
            streakName: 'Daily Spanish',
            members: [populatedMember],
        };
        const teamMembers = [populatedMember];
        const sendPushNotificationsAsync = jest.fn().mockResolvedValue(['message']);
        const chunkPushNotifications = jest.fn().mockResolvedValue(['message']);
        const expo: any = { chunkPushNotifications, sendPushNotificationsAsync };
        const request: any = {
            body: {
                streakType: StreakTypes.team,
                text: 'Started reading a book',
                streakId: 'streakId',
            },
        };
        const response: any = {
            locals: {
                user,
                teamStreak,
                teamMembers,
            },
        };
        const next = jest.fn();
        const teamStreakModel = { findById: jest.fn().mockResolvedValue(teamStreak) };
        const userModel = { findById: jest.fn().mockResolvedValue(populatedMember) };

        const middleware = getNotifyTeamMembersThatUserHasAddedANoteMiddleware(
            expo as any,
            teamStreakModel as any,
            userModel as any,
        );
        await middleware(request, response, next);
        expect(sendPushNotificationsAsync).toBeCalled();
        expect(chunkPushNotifications).toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('calls next with NotifyTeamMembersThatUserHasAddedANoteMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getNotifyTeamMembersThatUserHasAddedANoteMiddleware({} as any, {} as any, {} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.NotifyTeamMembersThatUserHasAddedANoteMiddleware, expect.any(Error)),
        );
    });
});

describe(`sendFormattedNoteMiddleware`, () => {
    const ERROR_MESSAGE = 'error';
    const savedNote = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('responds with status 201 with note', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const noteResponseLocals = {
            savedNote,
        };
        const response: any = { locals: noteResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedNoteMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(savedNote);
    });

    test('calls next with SendFormattedNoteMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedNote }, status };

        const request: any = {};
        const next = jest.fn();

        sendFormattedNoteMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedNoteMiddleware, expect.any(Error)));
    });
});

describe(`createNoteMiddlewares`, () => {
    test('that createNote middlewares are defined in the correct order', async () => {
        expect.assertions(5);

        expect(createNoteMiddlewares.length).toEqual(4);
        expect(createNoteMiddlewares[0]).toBe(createNoteBodyValidationMiddleware);
        expect(createNoteMiddlewares[1]).toBe(createNoteFromRequestMiddleware);
        expect(createNoteMiddlewares[2]).toBe(notifiyTeamMembersThatUserHasAddedANoteMiddleware);
        expect(createNoteMiddlewares[3]).toBe(sendFormattedNoteMiddleware);
    });
});
