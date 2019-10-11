/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createStreakTrackingEventBodyValidationMiddleware,
    getSaveStreakTrackingEventToDatabaseMiddleware,
    sendFormattedStreakTrackingEventMiddleware,
    createStreakTrackingEventMiddlewares,
    saveStreakTrackingEventToDatabaseMiddleware,
    validateStreakTrackingEventBody,
} from './createStreakTrackingEventMiddleware';
import { GroupStreakTypes, StreakTypes, StreakTrackingEventTypes } from '@streakoid/streakoid-sdk/lib';

describe(`createStreakTrackingEventBodyValidationMiddleware`, () => {
    const type = StreakTrackingEventTypes.lostStreak;
    const streakId = 'streakId';
    const userId = 'userId';
    const streakType = StreakTypes.soloStreak;
    const groupStreakType = GroupStreakTypes.team;

    const body = {
        type,
        streakId,
        userId,
        streakType,
        groupStreakType,
    };

    test('check that valid request passes', () => {
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

        createStreakTrackingEventBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct correct response when type is incorrect', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, type: 'incorrect' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakTrackingEventBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "type" fails because ["type" must be one of [lostStreak, maintainedStreak, inactiveStreak]]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when streakId is missing', () => {
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

        createStreakTrackingEventBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakId" fails because ["streakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when userId is missing', () => {
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

        createStreakTrackingEventBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when streakType is not valid', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakType: 'invalid' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakTrackingEventBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakType" fails because ["streakType" must be one of [soloStreak, groupMemberStreak]]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when groupStreakType is not valid', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, groupStreakType: 'invalid' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakTrackingEventBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupStreakType" fails because ["groupStreakType" must be one of [team, competition]]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('createStreakTrackingEventBodyValidationMiddleware', () => {
    test('if streak type equals soloStreak and groupStreakType is not defined call next', () => {
        const streakType = StreakTypes.soloStreak;
        const request: any = {
            body: {
                streakType,
            },
        };
        const response: any = {};
        const next = jest.fn();

        validateStreakTrackingEventBody(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if streak type equals soloStreak and groupStreakType is defined throw GroupStreakTypeShouldNotBeDefined', () => {
        const streakType = StreakTypes.soloStreak;
        const groupStreakType = GroupStreakTypes.team;
        const request: any = {
            body: {
                streakType,
                groupStreakType,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        validateStreakTrackingEventBody(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GroupStreakTypeShouldNotBeDefined));
    });

    test('if streak type equals groupMemberStreak and groupStreakType in undefined throw GroupStreakTypeMustBeDefined', () => {
        const streakType = StreakTypes.soloStreak;
        const groupStreakType = GroupStreakTypes.team;
        const request: any = {
            body: {
                streakType,
                groupStreakType,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        validateStreakTrackingEventBody(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GroupStreakTypeShouldNotBeDefined));
    });

    test('throws ValidateStreakTrackingEventBody error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        validateStreakTrackingEventBody(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.ValidateStreakTrackingEventBody, expect.any(Error)));
    });
});

describe(`saveStreakTrackingEventToDatabaseMiddleware`, () => {
    test('sets response.locals.savedStreakTrackingEvent', async () => {
        expect.assertions(2);

        const type = 'LostStreak';
        const streakId = 'abcdefg';
        const userId = '12345';

        const save = jest.fn().mockResolvedValue(true);

        class StreakTrackingEvent {
            type: string;
            streakId: string;
            userId: string;

            constructor({ type, streakId, userId }: any) {
                this.type = type;
                this.streakId = streakId;
                this.userId = userId;
            }

            save() {
                return save();
            }
        }
        const request: any = { body: { type, streakId, userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSaveStreakTrackingEventToDatabaseMiddleware(StreakTrackingEvent as any);

        await middleware(request, response, next);

        expect(response.locals.savedStreakTrackingEvent).toBeDefined();
        expect(save).toBeCalledWith();
    });

    test('calls next with CreateStreakTrackingEventFromRequestMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getSaveStreakTrackingEventToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateStreakTrackingEventFromRequestMiddleware, expect.any(Error)),
        );
    });
});

describe(`sendFormattedStreakTrackingEventMiddleware`, () => {
    test('sends savedStreakTrackingEvent in request', () => {
        expect.assertions(3);
        const type = 'LostStreak';
        const streakId = 'abcdefg';
        const userId = '12345';
        const savedStreakTrackingEvent = {
            type,
            streakId,
            userId,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedStreakTrackingEvent }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedStreakTrackingEventMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({ type, streakId, userId });
    });

    test('calls next with SendFormattedStreakTrackingEventMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendFormattedStreakTrackingEventMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedStreakTrackingEventMiddleware));
    });
});

describe(`createStreakTrackingEventMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(createStreakTrackingEventMiddlewares.length).toEqual(4);
        expect(createStreakTrackingEventMiddlewares[0]).toBe(createStreakTrackingEventBodyValidationMiddleware);
        expect(createStreakTrackingEventMiddlewares[1]).toBe(validateStreakTrackingEventBody);
        expect(createStreakTrackingEventMiddlewares[2]).toBe(saveStreakTrackingEventToDatabaseMiddleware);
        expect(createStreakTrackingEventMiddlewares[3]).toBe(sendFormattedStreakTrackingEventMiddleware);
    });
});
