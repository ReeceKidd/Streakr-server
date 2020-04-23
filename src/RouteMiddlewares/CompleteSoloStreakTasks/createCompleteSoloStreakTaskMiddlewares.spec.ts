/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCompleteSoloStreakTaskMiddlewares,
    retreiveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    sendTaskCompleteResponseMiddleware,
    createCompleteSoloStreakTaskDefinitionMiddleware,
    soloStreakExistsMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    getSoloStreakExistsMiddleware,
    getRetreiveUserMiddleware,
    getSetDayTaskWasCompletedMiddleware,
    getSetTaskCompleteTimeMiddleware,
    getSaveTaskCompleteMiddleware,
    getStreakMaintainedMiddleware,
    getSendTaskCompleteResponseMiddleware,
    setStreakStartDateMiddleware,
    getSetStreakStartDateMiddleware,
    completeSoloStreakTaskBodyValidationMiddleware,
    ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware,
    createCompleteSoloStreakActivityFeedItemMiddleware,
    getCreateCompleteSoloStreakActivityFeedItemMiddleware,
    unlockOneHundredDaySoloStreakAchievementForUserMiddleware,
    getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware,
} from './createCompleteSoloStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { AchievementTypes } from '@streakoid/streakoid-sdk/lib';
import AcheivmentTypes from '@streakoid/streakoid-sdk/lib/AchievementTypes';
import UserAchievement from '@streakoid/streakoid-sdk/lib/models/UserAchievement';

describe(`completeSoloStreakTaskBodyValidationMiddleware`, () => {
    const userId = 'abcdefgh';
    const soloStreakId = '123456';

    test('calls next() when correct body is supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { userId, soloStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeSoloStreakTaskBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct error response when userId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { soloStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeSoloStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when soloStreakId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { userId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeSoloStreakTaskBodyValidationMiddleware(request, response, next);

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
            body: { soloStreakId: 1234, userId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeSoloStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('soloStreakExistsMiddleware', () => {
    test('sets response.locals.soloStreak and calls next()', async () => {
        expect.assertions(3);
        const soloStreakId = 'abc';
        const request: any = {
            body: { soloStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = { findOne };
        const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: soloStreakId });
        expect(response.locals.soloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws SoloStreakDoesNotExist error when solo streak does not exist', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc';
        const request: any = {
            body: { soloStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(false));
        const soloStreakModel = { findOne };
        const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SoloStreakDoesNotExist));
    });

    test('throws SoloStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = { findOne };
        const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SoloStreakExistsMiddleware, expect.any(Error)));
    });
});

describe('ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware', () => {
    test('if soloStreak.completedToday is false it calls the next middleware', () => {
        const soloStreak = {
            completedToday: false,
        };
        const request: any = {};
        const response: any = { locals: { soloStreak } };
        const next = jest.fn();

        ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if soloStreak.completedToday is true it throws SoloStreakHasBeenCompletedToday error message', () => {
        const soloStreak = {
            completedToday: true,
        };
        const request: any = {};
        const response: any = { locals: { soloStreak } };
        const next = jest.fn();

        ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SoloStreakHasBeenCompletedToday));
    });

    test('throws EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware, expect.any(Error)),
        );
    });
});

describe('retreiveUserMiddleware', () => {
    test('sets response.locals.user and calls next()', async () => {
        expect.assertions(4);
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const userId = 'abcdefg';
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.user).toBeDefined();
        expect(findOne).toBeCalledWith({ _id: userId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws UserDoesNotExistError when user does not exist', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UserDoesNotExist));
    });

    test('throws RetreiveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userId = 'abcd';
        const findOne = jest.fn(() => ({}));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { status, locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveUserMiddleware, expect.any(Error)));
    });
});

describe('setTaskCompleteTimeMiddleware', () => {
    test('sets response.locals.taskCompleteTime and calls next()', () => {
        expect.assertions(4);
        const timezone = 'Europe/London';
        const tz = jest.fn(() => true);
        const moment = jest.fn(() => ({ tz }));
        const request: any = {};
        const response: any = { locals: { timezone } };
        const next = jest.fn();
        const middleware = getSetTaskCompleteTimeMiddleware(moment);

        middleware(request, response, next);

        expect(moment).toBeCalledWith();
        expect(tz).toBeCalledWith(timezone);
        expect(response.locals.taskCompleteTime).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws SetTaskCompleteTimeMiddlewre error on middleware failure', () => {
        expect.assertions(1);
        const tz = jest.fn(() => true);
        const moment = jest.fn(() => ({ tz }));
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getSetTaskCompleteTimeMiddleware(moment);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SetTaskCompleteTimeMiddleware, expect.any(Error)));
    });
});

describe('setStreakStartDateMiddleware', () => {
    test("sets soloStreak.startDate to taskCompleteTime if it's undefined and calls next()", async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const soloStreakModel: any = {
            findByIdAndUpdate,
        };
        const taskCompleteTime = new Date();
        const soloStreakId = 1;
        const soloStreak = {
            _id: soloStreakId,
            currentStreak: {
                startDate: undefined,
                numberOfDaysInARow: 0,
            },
        };
        const request: any = {};
        const response: any = { locals: { soloStreak, taskCompleteTime } };
        const next: any = jest.fn();
        const middleware = await getSetStreakStartDateMiddleware(soloStreakModel);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(soloStreakId, {
            $set: {
                currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 },
            },
        });
        expect(next).toBeCalledWith();
    });

    test("doesn't update soloStreak currentStreak.startDate if it's already set", async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn();
        const soloStreakModel: any = {
            findByIdAndUpdate,
        };
        const taskCompleteTime = new Date();
        const soloStreakId = 1;
        const soloStreak = {
            currentStreak: {
                startDate: new Date(),
            },
        };
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: { soloStreak, taskCompleteTime } };
        const next: any = jest.fn();
        const middleware = await getSetStreakStartDateMiddleware(soloStreakModel);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).not.toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('throws SetStreakStartDateMiddleware on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getSetStreakStartDateMiddleware(undefined as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SetStreakStartDateMiddleware, expect.any(Error)));
    });
});

describe('setDayTaskWasCompletedMiddleware', () => {
    test('sets response.locals.taskCompleteTime and calls next()', () => {
        expect.assertions(3);
        const dayFormat = 'DD/MM/YYYY';
        const format = jest.fn(() => true);
        const taskCompleteTime = {
            format,
        };
        const request: any = {};
        const response: any = { locals: { taskCompleteTime } };
        const next = jest.fn();
        const middleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

        middleware(request, response, next);

        expect(format).toBeCalledWith(dayFormat);
        expect(response.locals.taskCompleteDay).toBeDefined();
        expect(next).toBeDefined();
    });

    test('throws setDayTaskWasCompletedMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const dayFormat = 'DD/MM/YYYY';
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SetDayTaskWasCompletedMiddleware, expect.any(Error)));
    });
});

describe('createCompleteSoloStreakTaskDefinitionMiddleware', () => {
    test('sets completeSoloStreakTaskDefinition and calls next()', () => {
        expect.assertions(3);
        const soloStreakId = 'abcd123';
        const toDate = jest.fn(() => '27/03/2019');
        const taskCompleteTime = {
            toDate,
        };
        const taskCompleteDay = '09/05/2019';
        const userId = 'abc';
        const request: any = {
            body: { userId, soloStreakId },
        };
        const response: any = {
            locals: {
                taskCompleteTime,
                taskCompleteDay,
            },
        };
        const next = jest.fn();

        createCompleteSoloStreakTaskDefinitionMiddleware(request, response, next);

        expect(response.locals.completeSoloStreakTaskDefinition).toEqual({
            userId,
            streakId: soloStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        });
        expect(toDate).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateCompleteSoloStreakTaskDefinitionMiddlware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        createCompleteSoloStreakTaskDefinitionMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteSoloStreakTaskDefinitionMiddleware, expect.any(Error)),
        );
    });
});

describe(`saveTaskCompleteMiddleware`, () => {
    test('sets response.locals.completeSoloStreakTask and calls next', async () => {
        expect.assertions(3);
        const userId = 'abcd';
        const streakId = '1234';
        const taskCompleteTime = new Date();
        const taskCompleteDay = '09/05/2019';
        const completeSoloStreakTaskDefinition = {
            userId,
            streakId,
            taskCompleteTime,
            taskCompleteDay,
        };
        const save = jest.fn(() => Promise.resolve(true));
        class CompleteSoloStreakTaskModel {
            userId: string;
            streakId: string;
            taskCompleteTime: Date;
            taskCompleteDay: string;

            constructor(userId: string, streakId: string, taskCompleteTime: Date, taskCompleteDay: string) {
                this.userId = userId;
                (this.streakId = streakId), (this.taskCompleteTime = taskCompleteTime);
                this.taskCompleteDay = taskCompleteDay;
            }

            save() {
                return save();
            }
        }
        const request: any = {};
        const response: any = { locals: { completeSoloStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskCompleteMiddleware(CompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(response.locals.completeSoloStreakTask).toBeDefined();
        expect(save).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws SaveTaskCompleteMiddleware error on Middleware failure', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const streakId = '1234';
        const taskCompleteTime = new Date();
        const taskCompleteDay = '09/05/2019';
        const completeSoloStreakTaskDefinition = {
            userId,
            streakId,
            taskCompleteTime,
            taskCompleteDay,
        };
        const request: any = {};
        const response: any = { locals: { completeSoloStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskCompleteMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveTaskCompleteMiddleware, expect.any(Error)));
    });
});

describe('streakMaintainedMiddleware', () => {
    test('updates streak completedToday, increments number of days, sets active and calls next', async () => {
        expect.assertions(3);
        const soloStreakId = '123abc';
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const request: any = { body: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getStreakMaintainedMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            soloStreakId,
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
            { new: true },
        );
        expect(response.locals.soloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws StreakMaintainedMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const soloStreakId = '123abc';
        const soloStreakModel = {};
        const request: any = { params: { soloStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getStreakMaintainedMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.StreakMaintainedMiddleware, expect.any(Error)));
    });
});

describe(`unlockOneHundredDaySoloStreakAchievementForUserMiddleware`, () => {
    test('if solo streak current number of days equals 100 and user has not got the OneHundredSaySoloStreakAchievement it adds to their achievements', async () => {
        expect.assertions(3);
        const user = { _id: '_id', achievements: [{ achievementType: 'Other achievement' }] };
        const soloStreak = { _id: '_id', currentStreak: { numberOfDaysInARow: 100 } };

        const response: any = { locals: { user, soloStreak } };
        const request: any = {};
        const next = jest.fn();

        const achievementId = 'achievementId';
        const achievementType = AchievementTypes.oneHundredDaySoloStreak;

        const oneHundredSaySoloStreakAchievement: UserAchievement = {
            _id: achievementId,
            achievementType,
        };
        const achievement = {
            findOne: jest.fn().mockResolvedValue(oneHundredSaySoloStreakAchievement),
        };
        const userModel = {
            findByIdAndUpdate: jest.fn().mockResolvedValue(true),
        };

        const middleware = getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware(
            userModel as any,
            achievement as any,
        );

        await middleware(request, response, next);

        expect(achievement.findOne).toBeCalledWith({ achievementType: AcheivmentTypes.oneHundredDaySoloStreak });
        expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
            $addToSet: { achievements: oneHundredSaySoloStreakAchievement },
        });
        expect(next).toBeCalled();
    });

    test('if solo streak current number of days does not equal 100 middleware ends', async () => {
        expect.assertions(3);
        const user = { _id: '_id', achievements: [{ achievementType: 'Other achievement' }] };
        const soloStreak = { _id: '_id', currentStreak: { numberOfDaysInARow: 99 } };

        const response: any = { locals: { user, soloStreak } };
        const request: any = {};
        const next = jest.fn();

        const achievementId = 'achievementId';
        const achievementType = AchievementTypes.oneHundredDaySoloStreak;

        const oneHundredSaySoloStreakAchievement: UserAchievement = {
            _id: achievementId,
            achievementType,
        };
        const achievement = {
            findOne: jest.fn().mockResolvedValue(oneHundredSaySoloStreakAchievement),
        };
        const userModel = {
            findByIdAndUpdate: jest.fn().mockResolvedValue(true),
        };

        const middleware = getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware(
            userModel as any,
            achievement as any,
        );

        await middleware(request, response, next);

        expect(achievement.findOne).not.toBeCalled();
        expect(userModel.findByIdAndUpdate).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('if solo streak current number of days equals 100 but user already has achievement middleware ends', async () => {
        expect.assertions(3);
        const user = { _id: '_id', achievements: [{ achievementType: AcheivmentTypes.oneHundredDaySoloStreak }] };
        const soloStreak = { _id: '_id', currentStreak: { numberOfDaysInARow: 100 } };

        const response: any = { locals: { user, soloStreak } };
        const request: any = {};
        const next = jest.fn();

        const achievementId = 'achievementId';
        const achievementType = AchievementTypes.oneHundredDaySoloStreak;

        const oneHundredSaySoloStreakAchievement: UserAchievement = {
            _id: achievementId,
            achievementType,
        };
        const achievement = {
            findOne: jest.fn().mockResolvedValue(oneHundredSaySoloStreakAchievement),
        };
        const userModel = {
            findByIdAndUpdate: jest.fn().mockResolvedValue(true),
        };

        const middleware = getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware(
            userModel as any,
            achievement as any,
        );

        await middleware(request, response, next);

        expect(achievement.findOne).not.toBeCalled();
        expect(userModel.findByIdAndUpdate).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with UnlockOneHundredDaySoloStreakAchievementForUserMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware({} as any, {} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.UnlockOneHundredDaySoloStreakAchievementForUserMiddleware, expect.any(Error)),
        );
    });
});

describe('sendTaskCompleteResponseMiddleware', () => {
    test('sends completeSoloStreakTask response', () => {
        expect.assertions(3);
        const send = jest.fn(() => true);
        const status = jest.fn(() => ({ send }));
        const completeSoloStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskCompleteTime: new Date(),
            taskCompleteDay: '10/05/2019',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskCompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { completeSoloStreakTask }, status };
        const next = jest.fn();

        middleware(request, response, next);

        expect(status).toBeCalledWith(successResponseCode);
        expect(send).toBeCalledWith(completeSoloStreakTask);
        expect(next).toBeCalled();
    });

    test('throws SendTaskCompleteResponseMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const completeSoloStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskCompleteTime: new Date(),
            taskCompleteDay: '10/05/2019',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskCompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { completeSoloStreakTask } };
        const next = jest.fn();

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTaskCompleteResponseMiddleware, expect.any(Error)));
    });
});

describe(`createCompleteSoloStreakActivitFeedItemMiddleware`, () => {
    test('creates a new completedSoloStreakActivity', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const soloStreak = { _id: '_id' };
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { user, soloStreak } };
        const request: any = {};
        const next = jest.fn();

        const middleware = getCreateCompleteSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
        expect(next).not.toBeCalled();
    });

    test('calls next with CreateCompleteSoloStreakActivityMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateCompleteSoloStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteSoloStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createCompleteSoloStreakTaskMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(14);

        expect(createCompleteSoloStreakTaskMiddlewares.length).toEqual(13);
        expect(createCompleteSoloStreakTaskMiddlewares[0]).toBe(completeSoloStreakTaskBodyValidationMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[1]).toBe(soloStreakExistsMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[2]).toBe(ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[3]).toBe(retreiveUserMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[4]).toBe(setTaskCompleteTimeMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[5]).toBe(setStreakStartDateMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[6]).toBe(setDayTaskWasCompletedMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[7]).toBe(createCompleteSoloStreakTaskDefinitionMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[8]).toBe(saveTaskCompleteMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[9]).toBe(streakMaintainedMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[10]).toBe(
            unlockOneHundredDaySoloStreakAchievementForUserMiddleware,
        );
        expect(createCompleteSoloStreakTaskMiddlewares[11]).toBe(sendTaskCompleteResponseMiddleware);
        expect(createCompleteSoloStreakTaskMiddlewares[12]).toBe(createCompleteSoloStreakActivityFeedItemMiddleware);
    });
});
