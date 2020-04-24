/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createAchievementBodyValidationMiddleware,
    sendAchievementMiddleware,
    createAchievementMiddlewares,
    saveAchievementToDatabaseMiddleware,
    getSaveAchievementToDatabaseMiddleware,
} from './createAchievementMiddlewares';
import { AchievementTypes } from '@streakoid/streakoid-models/lib';

describe(`createAchievementBodyValidationMiddleware`, () => {
    const achievementType = AchievementTypes.oneHundredDaySoloStreak;
    const name = '100 Day Solo Streak';
    const description = 'Completed a solo streak for 100 days';

    const body = {
        achievementType,
        name,
        description,
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

        createAchievementBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct correct response when achievementType is incorrect', () => {
        expect.assertions(2);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, achievementType: 'incorrect' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createAchievementBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(next).not.toBeCalled();
    });

    test('sends correct correct response when achievementType is undefined', () => {
        expect.assertions(2);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, achievementType: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createAchievementBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(next).not.toBeCalled();
    });
});

describe(`saveAchievementToDatabaseMiddleware`, () => {
    test('sets response.locals.achievement', async () => {
        expect.assertions(2);

        const achievementType = AchievementTypes.oneHundredDaySoloStreak;
        const name = '100 Day Solo Streak';
        const description = 'Completed a solo streak for 100 days';

        const save = jest.fn().mockResolvedValue(true);

        const achievementModel = jest.fn(() => ({ save }));

        const request: any = { body: { achievementType, name, description } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getSaveAchievementToDatabaseMiddleware(achievementModel as any);

        await middleware(request, response, next);

        expect(response.locals.achievement).toBeDefined();
        expect(save).toBeCalled();
    });

    test('calls next with SaveAchievementToDatabaseMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getSaveAchievementToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveAchievementToDatabaseMiddleware, expect.any(Error)));
    });
});

describe(`sendAchievementMiddleware`, () => {
    test('sends savedAchievement in request', () => {
        expect.assertions(3);
        const achievementType = 'LostStreak';
        const subjectId = 'subjectId';
        const userId = '12345';
        const achievement = {
            achievementType,
            subjectId,
            userId,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { achievement }, status };
        const request: any = {};
        const next = jest.fn();

        sendAchievementMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({ achievementType, subjectId, userId });
    });

    test('calls next with SendAchievementMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendAchievementMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendAchievementMiddleware));
    });
});

describe(`createAchievementMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(createAchievementMiddlewares.length).toEqual(3);
        expect(createAchievementMiddlewares[0]).toBe(createAchievementBodyValidationMiddleware);
        expect(createAchievementMiddlewares[1]).toBe(saveAchievementToDatabaseMiddleware);
        expect(createAchievementMiddlewares[2]).toBe(sendAchievementMiddleware);
    });
});
