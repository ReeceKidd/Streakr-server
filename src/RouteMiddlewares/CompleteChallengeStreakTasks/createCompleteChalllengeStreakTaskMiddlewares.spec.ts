/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCompleteChallengeStreakTaskMiddlewares,
    retrieveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    sendTaskCompleteResponseMiddleware,
    challengeStreakExistsMiddleware,
    saveTaskCompleteMiddleware,
    increaseNumberOfDaysInARowForChallengeStreakMiddleware,
    getChallengeStreakExistsMiddleware,
    getRetrieveUserMiddleware,
    getSetDayTaskWasCompletedMiddleware,
    getSetTaskCompleteTimeMiddleware,
    getSaveTaskCompleteMiddleware,
    getIncreaseNumberOfDaysInARowForChallengeStreakMiddleware,
    getSendTaskCompleteResponseMiddleware,
    setStreakStartDateMiddleware,
    getSetStreakStartDateMiddleware,
    completeChallengeStreakTaskBodyValidationMiddleware,
    ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware,
    getCreateCompleteChallengeStreakActivityFeedItemMiddleware,
    createCompleteChallengeStreakActivityFeedItemMiddleware,
    retrieveChallengeMiddleware,
    getRetrieveChallengeMiddleware,
    getIncreaseTotalStreakCompletesForUserMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    unlockOneHundredDayChallengeStreakAchievementForUserMiddleware,
    getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware,
    getSendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware,
    sendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware,
    increaseTotalTimesTrackedForChallengeStreakMiddleware,
    creditCoinsToUserForCompletingChallengeStreakMiddleware,
    creditOidXpToUserForCompletingChallengeStreakMiddleware,
    getIncreaseTotalTimesTrackedForChallengeStreakMiddleware,
    getCreditCoinsToUserForCompletingChallengeStreakMiddleware,
    getCreditOidXpToUserForCompletingChallengeStreakMiddleware,
} from './createCompleteChallengeStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';
import { getMockUser } from '../../testHelpers/getMockUser';
import { OneHundredDayChallengeStreakDatabaseAchievement } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { coinCreditValues } from '../../helpers/coinCreditValues';
import { CoinCredits } from '@streakoid/streakoid-models/lib/Types/CoinCredits';
import { CompleteChallengeStreakCredit } from '@streakoid/streakoid-models/lib/Models/CoinCreditTypes';
import { oidXpValues } from '../../helpers/oidXpValues';

describe('createCompleteChallengeStreakTaskMiddlewares', () => {
    describe(`completeChallengeStreakTaskBodyValidationMiddleware`, () => {
        const userId = 'abcdefgh';
        const challengeStreakId = '123456';

        test('calls next() when correct body is supplied', () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { userId, challengeStreakId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            completeChallengeStreakTaskBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
        });

        test('sends correct error response when userId is missing', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { challengeStreakId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            completeChallengeStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when challengeStreakId is missing', () => {
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

            completeChallengeStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "challengeStreakId" fails because ["challengeStreakId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when challengeStreakId is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { challengeStreakId: 1234, userId },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            completeChallengeStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "challengeStreakId" fails because ["challengeStreakId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('challengeStreakExistsMiddleware', () => {
        test('sets response.locals.challengeStreak and calls next()', async () => {
            expect.assertions(3);
            const challengeStreakId = 'abc';
            const request: any = {
                body: { challengeStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findOne };
            const middleware = getChallengeStreakExistsMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: challengeStreakId });
            expect(response.locals.challengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws ChallengeStreakDoesNotExist error when challenge streak does not exist', async () => {
            expect.assertions(1);
            const challengeStreakId = 'abc';
            const request: any = {
                body: { challengeStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(false));
            const challengeStreakModel = { findOne };
            const middleware = getChallengeStreakExistsMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.ChallengeStreakDoesNotExist));
        });

        test('throws ChallengeStreakExistsMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findOne };
            const middleware = getChallengeStreakExistsMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.ChallengeStreakExistsMiddleware, expect.any(Error)));
        });
    });

    describe('ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware', () => {
        test('if challengeStreak.completedToday is false it calls the next middleware', () => {
            const challengeStreak = {
                completedToday: false,
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();

            ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('if challengeStreak.completedToday is true it throws ChallengeStreakHasBeenCompletedToday error message', () => {
            const challengeStreak = {
                completedToday: true,
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();

            ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.ChallengeStreakHasBeenCompletedToday));
        });

        test('throws EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('retrieveUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'userId';
            const request: any = { body: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteChallengeStreakTaskUserDoesNotExist when user does not exist', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskUserDoesNotExist));
        });

        test('throws RetrieveUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { body: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteChallengeStreakTaskRetrieveUserMiddleware, expect.any(Error)),
            );
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

        test('throws SetTaskCompleteTimeMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const tz = jest.fn(() => true);
            const moment = jest.fn(() => ({ tz }));
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getSetTaskCompleteTimeMiddleware(moment);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateCompleteChallengeStreakTaskSetTaskCompleteTimeMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('setStreakStartDateMiddleware', () => {
        test("sets challengeStreak.startDate to taskCompleteTime if it's undefined and calls next()", async () => {
            expect.assertions(2);
            const updateOne = jest.fn().mockResolvedValue(true);
            const challengeStreakModel: any = {
                updateOne,
            };
            const taskCompleteTime = new Date();
            const challengeStreakId = 1;
            const challengeStreak = {
                _id: challengeStreakId,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0,
                },
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetStreakStartDateMiddleware(challengeStreakModel);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: challengeStreakId },
                {
                    currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 },
                },
            );
            expect(next).toBeCalledWith();
        });

        test("doesn't update challengeStreak currentStreak.startDate if it's already set", async () => {
            expect.assertions(2);
            const findByIdAndUpdate = jest.fn();
            const challengeStreakModel: any = {
                findByIdAndUpdate,
            };
            const taskCompleteTime = new Date();
            const challengeStreakId = 1;
            const challengeStreak = {
                currentStreak: {
                    startDate: new Date(),
                },
            };
            const request: any = { params: { challengeStreakId } };
            const response: any = { locals: { challengeStreak, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetStreakStartDateMiddleware(challengeStreakModel);

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

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateCompleteChallengeStreakTaskSetStreakStartDateMiddleware,
                    expect.any(Error),
                ),
            );
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

    describe(`saveTaskCompleteMiddleware`, () => {
        test('sets response.locals.completeChallengeStreakTask and calls next', async () => {
            expect.assertions(3);
            const challengeStreakId = 'abcd123';
            const toDate = jest.fn(() => '27/03/2019');
            const taskCompleteTime = {
                toDate,
            };
            const taskCompleteDay = '09/05/2019';
            const userId = 'abc';
            const request: any = {
                body: { userId, challengeStreakId },
            };
            const response: any = {
                locals: {
                    taskCompleteTime,
                    taskCompleteDay,
                },
            };
            const save = jest.fn().mockResolvedValue(true);
            const CompleteChallengeStreakTaskModel = jest.fn(() => ({ save }));
            const next = jest.fn();
            const middleware = getSaveTaskCompleteMiddleware(CompleteChallengeStreakTaskModel as any);

            await middleware(request, response, next);

            expect(response.locals.completeChallengeStreakTask).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const streakId = '1234';
            const taskCompleteTime = new Date();
            const taskCompleteDay = '09/05/2019';
            const completeChallengeStreakTaskDefinition = {
                userId,
                streakId,
                taskCompleteTime,
                taskCompleteDay,
            };
            const request: any = {};
            const response: any = { locals: { completeChallengeStreakTaskDefinition } };
            const next = jest.fn();
            const middleware = getSaveTaskCompleteMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseNumberOfDaysInARowForChallengeStreakMiddleware', () => {
        test('updates streak completedToday, increments number of days, sets active and calls next', async () => {
            expect.assertions(4);
            const challengeStreakId = '123abc';
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const challengeStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { challengeStreakId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getIncreaseNumberOfDaysInARowForChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                challengeStreakId,
                {
                    completedToday: true,
                    $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                    active: true,
                },
                { new: true },
            );
            expect(lean).toBeCalled();
            expect(response.locals.challengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteChallengeStreakTaskIncreaseNumberOfDaysInARowForChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const challengeStreakId = '123abc';
            const challengeStreakModel = {};
            const request: any = { params: { challengeStreakId } };
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseNumberOfDaysInARowForChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateCompleteChallengeStreakTaskIncreaseNumberOfDaysInARowForChallengeStreakMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseTotalStreakCompletesForUserMiddleware', () => {
        test('increments totalStreakCompletes on user by one and calls next', async () => {
            expect.assertions(3);
            const userId = '123abc';
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const userModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getIncreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                userId,
                {
                    $inc: { totalStreakCompletes: 1 },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CompleteChallengeStreakTaskIncreaseTotalStreakCompletesForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CompleteChallengeStreakTaskIncreaseTotalStreakCompletesForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseTotalTimesTrackedForChallengeStreakMiddleware', () => {
        test('increments totalTimesTracked for challenge streak by one and calls next', async () => {
            expect.assertions(3);
            const challengeStreakId = '123abc';
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { challengeStreakId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getIncreaseTotalTimesTrackedForChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                challengeStreakId,
                {
                    $inc: { totalTimesTracked: 1 },
                },
                { new: true },
            );
            expect(response.locals.challengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseTotalTimesTrackedForChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseTotalTimesTrackedForChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IncreaseTotalTimesTrackedForChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('retrieveChallengeMiddleware', () => {
        test('sets response.locals.challenge and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const challengeModel = { findOne };
            const request: any = {};
            const response: any = { locals: { challengeStreak: { _id: '_id', challengeId: 'challengeId' } } };
            const next = jest.fn();
            const middleware = getRetrieveChallengeMiddleware(challengeModel as any);

            await middleware(request, response, next);

            expect(response.locals.challenge).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: response.locals.challengeStreak.challengeId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteChallengeStreakTaskUserDoesNotExist when user does not exist', async () => {
            expect.assertions(1);
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const challengeModel = { findOne };
            const request: any = {};
            const response: any = { locals: { challengeStreak: { _id: '_id' } } };
            const next = jest.fn();
            const middleware = getRetrieveChallengeMiddleware(challengeModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteChallengeStreakTaskChallengeDoesNotExist),
            );
        });

        test('throws RetrieveChallengeMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveChallengeMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateCompleteChallengeStreakTaskRetrieveChallengeMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('creditCoinsToUserForCompletingChallengeStreakMiddleware', () => {
        test('credits user account with coins for completing challenge streaks', async () => {
            expect.assertions(3);
            const challengeStreakId = '123abc';
            const userId = 'userId';
            const challenge = { _id: '_id', name: 'reading' };
            const createCoinTransaction = jest.fn(() => Promise.resolve(true));
            const request: any = { body: { challengeStreakId, userId } };
            const response: any = { locals: { challenge } };
            const next = jest.fn();
            const middleware = getCreditCoinsToUserForCompletingChallengeStreakMiddleware(createCoinTransaction as any);

            await middleware(request, response, next);

            const coinCreditType: CompleteChallengeStreakCredit = {
                coinCreditType: CoinCredits.completeChallengeStreak,
                challengeStreakId,
                challengeId: challenge._id,
                challengeName: challenge.name,
            };
            const coins = coinCreditValues[CoinCredits.completeChallengeStreak];
            expect(createCoinTransaction).toBeCalledWith({
                userId,
                coinCreditType,
                coins,
            });
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreditCoinsToUserForCompletingChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getCreditCoinsToUserForCompletingChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreditCoinsToUserForCompletingChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('creditOidXpToUserForCompletingChallengeStreakMiddleware', () => {
        test('credits user account with xp for completing challenge streaks', async () => {
            expect.assertions(3);
            const challengeStreakId = '123abc';
            const userId = 'userId';
            const challenge = { _id: '_id', name: 'reading' };
            const createOidXpTransaction = jest.fn(() => Promise.resolve(true));
            const request: any = { body: { challengeStreakId, userId } };
            const response: any = { locals: { challenge } };
            const next = jest.fn();
            const middleware = getCreditOidXpToUserForCompletingChallengeStreakMiddleware(
                createOidXpTransaction as any,
            );

            await middleware(request, response, next);

            expect(createOidXpTransaction).toBeCalledWith({
                userId,
                source: {
                    oidXpSourceType: OidXpSourcesTypes.challengeStreakComplete,
                    challengeStreakId,
                    challengeId: challenge._id,
                    challengeName: challenge.name,
                },
                oidXp: oidXpValues[OidXpSourcesTypes.challengeStreakComplete],
            });
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreditOidXpToUserForCompletingChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getCreditOidXpToUserForCompletingChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreditOidXpToUserForCompletingChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`unlockOneHundredDayChallengeStreakAchievementForUserMiddleware`, () => {
        test('if challenge streak current number of days equals 100 and user has not got the OneHundredDayChallengeStreakAchievement it adds to their achievements', async () => {
            expect.assertions(4);
            const user = { _id: '_id', achievements: [{ achievementType: 'Other achievement' }] };
            const challengeStreak = { _id: '_id', currentStreak: { numberOfDaysInARow: 100 } };

            const response: any = { locals: { user, challengeStreak } };
            const request: any = {};
            const next = jest.fn();

            const achievementId = 'achievementId';
            const achievementType = AchievementTypes.oneHundredDayChallengeStreak;

            const oneHundredSayChallengeStreakAchievement: UserAchievement = {
                _id: achievementId,
                achievementType,
            };
            const achievement = {
                findOne: jest.fn().mockResolvedValue(oneHundredSayChallengeStreakAchievement),
            };
            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const middleware = getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware(
                userModel as any,
                achievement as any,
            );

            await middleware(request, response, next);

            expect(achievement.findOne).toBeCalledWith({
                achievementType: AchievementTypes.oneHundredDayChallengeStreak,
            });
            expect(userModel.findByIdAndUpdate).toBeCalledWith(user._id, {
                $addToSet: { achievements: oneHundredSayChallengeStreakAchievement },
            });
            expect(response.locals.oneHundredDayChallengeStreakAchievement).toBeDefined();
            expect(next).toBeCalled();
        });

        test('if challenge streak current number of days does not equal 100 middleware ends', async () => {
            expect.assertions(4);
            const user = { _id: '_id', achievements: [{ achievementType: 'Other achievement' }] };
            const challengeStreak = { _id: '_id', currentStreak: { numberOfDaysInARow: 99 } };

            const response: any = { locals: { user, challengeStreak } };
            const request: any = {};
            const next = jest.fn();

            const achievementId = 'achievementId';
            const achievementType = AchievementTypes.oneHundredDayChallengeStreak;

            const oneHundredSayChallengeStreakAchievement: UserAchievement = {
                _id: achievementId,
                achievementType,
            };
            const achievement = {
                findOne: jest.fn().mockResolvedValue(oneHundredSayChallengeStreakAchievement),
            };
            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const middleware = getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware(
                userModel as any,
                achievement as any,
            );

            await middleware(request, response, next);

            expect(achievement.findOne).not.toBeCalled();
            expect(userModel.findByIdAndUpdate).not.toBeCalled();
            expect(response.locals.achievementUnlocked).toBeUndefined();
            expect(next).toBeCalled();
        });

        test('if challenge streak current number of days equals 100 but user already has achievement middleware ends', async () => {
            expect.assertions(4);
            const user = {
                _id: '_id',
                achievements: [{ achievementType: AchievementTypes.oneHundredDayChallengeStreak }],
            };
            const challengeStreak = { _id: '_id', currentStreak: { numberOfDaysInARow: 100 } };

            const response: any = { locals: { user, challengeStreak } };
            const request: any = {};
            const next = jest.fn();

            const achievementId = 'achievementId';
            const achievementType = AchievementTypes.oneHundredDayChallengeStreak;

            const oneHundredSayChallengeStreakAchievement: UserAchievement = {
                _id: achievementId,
                achievementType,
            };
            const achievement = {
                findOne: jest.fn().mockResolvedValue(oneHundredSayChallengeStreakAchievement),
            };
            const userModel = {
                findByIdAndUpdate: jest.fn().mockResolvedValue(true),
            };

            const middleware = getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware(
                userModel as any,
                achievement as any,
            );

            await middleware(request, response, next);

            expect(achievement.findOne).not.toBeCalled();
            expect(userModel.findByIdAndUpdate).not.toBeCalled();
            expect(response.locals.achievementUnlocked).toBeUndefined();
            expect(next).toBeCalled();
        });

        test('calls next with UnlockOneHundredDayChallengeStreakAchievementForUserMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware({} as any, {} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.UnlockOneHundredDayChallengeStreakAchievementForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`sendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware`, () => {
        test('if oneHundedDayChallengeStreakAchievement is not defined just call next', async () => {
            expect.assertions(1);

            const user = getMockUser({ _id: 'abc' });

            const response: any = {
                locals: {
                    user,
                },
            };
            const request: any = { body: {} };

            const next = jest.fn();

            const middleware = getSendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware(
                {} as any,
            );

            await middleware(request, response, next);

            expect(next).toBeCalled();
        });

        test('if oneHundredDayChallengeStreakAchievement is defined, user has an androidEndpointArn or iosEndpointArn and achievement updates are enabled it sends an unlocked achievement push notification', async () => {
            expect.assertions(2);
            const oneHundredDayChallengeStreakAchievement: OneHundredDayChallengeStreakDatabaseAchievement = {
                _id: '_id',
                achievementType: AchievementTypes.oneHundredDayChallengeStreak,
                createdAt: 'createdAt',
                description: 'Completed 100 days',
                name: '100 Days',
                updatedAt: 'updatedAt',
            };
            const user = getMockUser({ _id: 'abc' });

            const sendPushNotification = jest.fn().mockResolvedValue(true);
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    oneHundredDayChallengeStreakAchievement,
                },
            };
            const next = jest.fn();

            const middleware = getSendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware(
                sendPushNotification as any,
            );
            await middleware(request, response, next);
            expect(sendPushNotification).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('calls next with SendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getSendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware(
                {} as any,
            );

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.SendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('sendTaskCompleteResponseMiddleware', () => {
        test('sends completeChallengeStreakTask response', () => {
            expect.assertions(3);
            const send = jest.fn(() => true);
            const status = jest.fn(() => ({ send }));
            const completeChallengeStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskCompleteTime: new Date(),
                taskCompleteDay: '10/05/2019',
            };
            const successResponseCode = 200;
            const middleware = getSendTaskCompleteResponseMiddleware(successResponseCode);
            const request: any = {};
            const response: any = { locals: { completeChallengeStreakTask }, status };
            const next = jest.fn();

            middleware(request, response, next);

            expect(status).toBeCalledWith(successResponseCode);
            expect(send).toBeCalledWith(completeChallengeStreakTask);
            expect(next).toBeCalled();
        });

        test('throws SendTaskCompleteResponseMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const completeChallengeStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskCompleteTime: new Date(),
                taskCompleteDay: '10/05/2019',
            };
            const successResponseCode = 200;
            const middleware = getSendTaskCompleteResponseMiddleware(successResponseCode);
            const request: any = {};
            const response: any = { locals: { completeChallengeStreakTask } };
            const next = jest.fn();

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`createCompleteChallengeStreakActivitFeedItemMiddleware`, () => {
        test('creates a new completedChallengeStreakActivity', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const challengeStreak = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challengeStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateCompleteChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateCompleteChallengeStreakActivityMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateCompleteChallengeStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteChallengeStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', async () => {
        expect.assertions(19);

        expect(createCompleteChallengeStreakTaskMiddlewares.length).toEqual(18);
        expect(createCompleteChallengeStreakTaskMiddlewares[0]).toBe(
            completeChallengeStreakTaskBodyValidationMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[1]).toBe(challengeStreakExistsMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[2]).toBe(
            ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[3]).toBe(retrieveUserMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[4]).toBe(setTaskCompleteTimeMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[5]).toBe(setStreakStartDateMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[6]).toBe(setDayTaskWasCompletedMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[7]).toBe(saveTaskCompleteMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[8]).toBe(
            increaseNumberOfDaysInARowForChallengeStreakMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[9]).toBe(increaseTotalStreakCompletesForUserMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[10]).toBe(
            increaseTotalTimesTrackedForChallengeStreakMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[11]).toBe(retrieveChallengeMiddleware);
        expect(createCompleteChallengeStreakTaskMiddlewares[12]).toBe(
            creditCoinsToUserForCompletingChallengeStreakMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[13]).toBe(
            creditOidXpToUserForCompletingChallengeStreakMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[14]).toBe(
            unlockOneHundredDayChallengeStreakAchievementForUserMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[15]).toBe(
            sendOneHundredDayChallengeStreakAchievementUnlockedPushNotificationMiddleware,
        );
        expect(createCompleteChallengeStreakTaskMiddlewares[16]).toBe(sendTaskCompleteResponseMiddleware);

        expect(createCompleteChallengeStreakTaskMiddlewares[17]).toBe(
            createCompleteChallengeStreakActivityFeedItemMiddleware,
        );
    });
});
