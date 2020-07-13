/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createIncompleteChallengeStreakTaskMiddlewares,
    retrieveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    sendTaskIncompleteResponseMiddleware,
    challengeStreakExistsMiddleware,
    saveTaskIncompleteMiddleware,
    getIncompleteChallengeStreakMiddleware,
    getChallengeStreakExistsMiddleware,
    getRetrieveUserMiddleware,
    getSetDayTaskWasIncompletedMiddleware,
    getSetTaskIncompleteTimeMiddleware,
    getSaveTaskIncompleteMiddleware,
    incompleteChallengeStreakMiddleware,
    getSendTaskIncompleteResponseMiddleware,
    incompleteChallengeStreakTaskBodyValidationMiddleware,
    ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    getResetStreakStartDateMiddleware,
    getCreateIncompleteChallengeStreakActivityFeedItemMiddleware,
    createIncompleteChallengeStreakActivityFeedItemMiddleware,
    retrieveChallengeMiddleware,
    getRetrieveChallengeMiddleware,
    decreaseTotalStreakCompletesForUserMiddleware,
    getDecreaseTotalStreakCompletesForUserMiddleware,
    decreaseTotalTimesTrackedForChallengeStreakMiddleware,
    chargeCoinsToUserForIncompletingChallengeStreakMiddleware,
    chargeOidXpToUserForIncompletingChallengeStreakMiddleware,
    getDecreaseTotalTimesTrackedForChallengeStreakMiddleware,
    getChargeCoinsToUserForIncompletingChallengeStreakMiddleware,
    getChargeOidXpToUserForIncompletingChallengeStreakMiddleware,
} from './createIncompleteChallengeStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { oidXpValues } from '../../helpers/oidXpValues';
import { IncompleteChallengeStreakCharge } from '@streakoid/streakoid-models/lib/Models/CoinChargeTypes';
import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';
import { coinChargeValues } from '../../helpers/coinChargeValues';

describe('createIncompleteChallengeStreakTaskMiddlewares', () => {
    describe(`incompleteChallengeStreakTaskBodyValidationMiddleware`, () => {
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

            incompleteChallengeStreakTaskBodyValidationMiddleware(request, response, next);

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

            incompleteChallengeStreakTaskBodyValidationMiddleware(request, response, next);

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

            incompleteChallengeStreakTaskBodyValidationMiddleware(request, response, next);

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

            incompleteChallengeStreakTaskBodyValidationMiddleware(request, response, next);

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

        test('throws CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist error when challenge streak does not exist', async () => {
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

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist),
            );
        });

        test('throws CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findOne };
            const middleware = getChallengeStreakExistsMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware', () => {
        test('if challengeStreak.completedToday is true it calls next middleware', () => {
            const challengeStreak = {
                completedToday: true,
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();

            ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('if challengeStreak.completedToday is false it throws ChallengeStreakHasNotBeenCompletedToday error message', () => {
            const challengeStreak = {
                completedToday: false,
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();

            ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.ChallengeStreakHasNotBeenCompletedToday));
        });

        test('throws EnsureChallengeStreakTaskHasBeeenCompletedTodayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.EnsureChallengeStreakTaskHasBeenCompletedTodayMiddleware, expect.any(Error)),
            );
        });
    });

    describe('resetStreakStartDateMiddleware', () => {
        test('if currentStreak number of days is 1 and this is the first streak it resets the current streak', async () => {
            expect.assertions(3);
            const lean = jest.fn(() => true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const challengeStreakModel: any = {
                findByIdAndUpdate,
            };
            const challengeStreakId = 1;
            const challengeStreak = {
                _id: challengeStreakId,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 1,
                },
                pastStreaks: [],
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next: any = jest.fn();
            const middleware = await getResetStreakStartDateMiddleware(challengeStreakModel);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                challengeStreakId,
                {
                    currentStreak: { startDate: null, numberOfDaysInARow: 0 },
                },
                { new: true },
            );
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test("doesn't update challengeStreak in number of days in a row > 1", async () => {
            expect.assertions(2);
            const findByIdAndUpdate = jest.fn();
            const challengeStreakModel: any = {
                findByIdAndUpdate,
            };
            const challengeStreakId = 2;
            const challengeStreak = {
                currentStreak: {
                    startDate: new Date(),
                    numberOfDaysInARow: 2,
                },
            };
            const request: any = { params: { challengeStreakId } };
            const response: any = { locals: { challengeStreak } };
            const next: any = jest.fn();
            const middleware = await getResetStreakStartDateMiddleware(challengeStreakModel);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws ResetStreakStartDateMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getResetStreakStartDateMiddleware(undefined as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.ResetStreakStartDateMiddleware, expect.any(Error)));
        });
    });

    describe('retrieveUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'abcdefg';
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

        test('throws CreateIncompleteChallengeStreakTaskUserDoesNotExist when user does not exist', async () => {
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskUserDoesNotExist));
        });

        test('throws CreateIncompleteChallengeStreakTaskRetrieveUserMiddleware error on middleware failure', async () => {
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
                new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskRetrieveUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('setTaskIncompleteTimeMiddleware', () => {
        test('sets response.locals.taskIncompleteTime and calls next()', () => {
            expect.assertions(4);
            const timezone = 'Europe/London';
            const tz = jest.fn(() => true);
            const moment = jest.fn(() => ({ tz }));
            const request: any = {};
            const response: any = { locals: { timezone } };
            const next = jest.fn();
            const middleware = getSetTaskIncompleteTimeMiddleware(moment);

            middleware(request, response, next);

            expect(moment).toBeCalledWith();
            expect(tz).toBeCalledWith(timezone);
            expect(response.locals.taskIncompleteTime).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws SetTaskIncompleteTimeMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const tz = jest.fn(() => true);
            const moment = jest.fn(() => ({ tz }));
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getSetTaskIncompleteTimeMiddleware(moment);

            middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SetTaskIncompleteTimeMiddleware, expect.any(Error)));
        });
    });

    describe('setDayTaskWasIncompletedMiddleware', () => {
        test('sets response.locals.taskIncompleteTime and calls next()', () => {
            expect.assertions(3);
            const dayFormat = 'DD/MM/YYYY';
            const format = jest.fn(() => true);
            const taskIncompleteTime = {
                format,
            };
            const request: any = {};
            const response: any = { locals: { taskIncompleteTime } };
            const next = jest.fn();
            const middleware = getSetDayTaskWasIncompletedMiddleware(dayFormat);

            middleware(request, response, next);

            expect(format).toBeCalledWith(dayFormat);
            expect(response.locals.taskIncompleteDay).toBeDefined();
            expect(next).toBeDefined();
        });

        test('throws setDayTaskWasIncompletedMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const dayFormat = 'DD/MM/YYYY';
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getSetDayTaskWasIncompletedMiddleware(dayFormat);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SetDayTaskWasIncompletedMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`saveTaskIncompleteMiddleware`, () => {
        test('sets response.locals.incompleteChallengeStreakTask and calls next', async () => {
            expect.assertions(3);
            const userId = 'abcd';
            const challengeStreakId = '1234';
            const toDate = jest.fn(() => '27/03/2019');
            const taskIncompleteTime = {
                toDate,
            };
            const taskIncompleteDay = '09/05/2019';

            const save = jest.fn().mockResolvedValue(true);
            const IncompleteChallengeStreakTaskModel = jest.fn(() => ({ save }));
            const request: any = { body: { userId, challengeStreakId } };
            const response: any = { locals: { taskIncompleteDay, taskIncompleteTime } };
            const next = jest.fn();
            const middleware = getSaveTaskIncompleteMiddleware(IncompleteChallengeStreakTaskModel as any);

            await middleware(request, response, next);

            expect(response.locals.incompleteChallengeStreakTask).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws SaveTaskIncompleteMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const streakId = '1234';
            const taskIncompleteTime = new Date();
            const taskIncompleteDay = '09/05/2019';
            const incompleteChallengeStreakTaskDefinition = {
                userId,
                streakId,
                taskIncompleteTime,
                taskIncompleteDay,
            };
            const request: any = {};
            const response: any = { locals: { incompleteChallengeStreakTaskDefinition } };
            const next = jest.fn();
            const middleware = getSaveTaskIncompleteMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SaveTaskIncompleteMiddleware, expect.any(Error)));
        });
    });

    describe('incompleteChallengeStreakMiddleware', () => {
        test('if number of days in a row of current streak is not equal to 0 it updates streak completedToday, descrements number of days by one, and calls next', async () => {
            expect.assertions(2);
            const challengeStreakId = '123abc';
            const challengeStreak = {
                _id: challengeStreakId,
                currentStreak: {
                    numberOfDaysInARow: 1,
                },
            };
            const updateOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = {
                updateOne,
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();
            const middleware = getIncompleteChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: challengeStreakId },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                },
            );
            expect(next).toBeCalledWith();
        });

        test('if number of days in a row of current streak is equal to 0 it updates streak completedToday, set currentStreak to default values, sets active to false and calls next', async () => {
            expect.assertions(2);
            const challengeStreakId = '123abc';
            const challengeStreak = {
                _id: challengeStreakId,
                currentStreak: {
                    numberOfDaysInARow: 0,
                },
            };
            const updateOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = {
                updateOne,
            };
            const request: any = {};
            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();
            const middleware = getIncompleteChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: challengeStreakId },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    'currentStreak.startDate': null,
                    active: false,
                },
            );
            expect(next).toBeCalledWith();
        });

        test('throws IncompleteChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const challengeStreakModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncompleteChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IncompleteChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('decreaseTotalStreakCompletesForUserMiddleware', () => {
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
            const middleware = getDecreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                userId,
                {
                    $inc: { totalStreakCompletes: -1 },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws IncompleteChallengeStreakTaskDecreaseTotalStreakCompletesForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDecreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.IncompleteChallengeStreakTaskDecreaseTotalStreakCompletesForUserMiddleware,
                    expect.any(Error),
                ),
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

        test('throws CreateIncompleteChallengeStreakTaskUserDoesNotExist when user does not exist', async () => {
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
                new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeDoesNotExist),
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
                    ErrorType.CreateIncompleteChallengeStreakTaskRetrieveChallengeMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('decreaseTotalTimesTrackedForChallengeStreakMiddleware', () => {
        test('decreases totalTimesTracked for challenge streak by one and calls next', async () => {
            expect.assertions(3);
            const challengeStreakId = '123abc';
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { challengeStreakId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDecreaseTotalTimesTrackedForChallengeStreakMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                challengeStreakId,
                {
                    $inc: { totalTimesTracked: -1 },
                },
                { new: true },
            );
            expect(response.locals.challengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws DecreaseTotalTimesTrackedForChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDecreaseTotalTimesTrackedForChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DecreaseTotalTimesTrackedForChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('chargeCoinsToUserForCompletingChallengeStreakMiddleware', () => {
        test('charges user account with coins for completing challenge streaks', async () => {
            expect.assertions(3);
            const challengeStreakId = '123abc';
            const userId = 'userId';
            const challenge = { _id: '_id', name: 'reading' };
            const createCoinTransaction = jest.fn(() => Promise.resolve(true));
            const request: any = { body: { challengeStreakId, userId } };
            const response: any = { locals: { challenge } };
            const next = jest.fn();
            const middleware = getChargeCoinsToUserForIncompletingChallengeStreakMiddleware(
                createCoinTransaction as any,
            );

            await middleware(request, response, next);

            const coinChargeType: IncompleteChallengeStreakCharge = {
                coinChargeType: CoinCharges.incompleteChallengeStreak,
                challengeId: challenge._id,
                challengeName: challenge.name,
                challengeStreakId,
            };
            const coinsToCharge = coinChargeValues[CoinCharges.incompleteChallengeStreak];

            expect(createCoinTransaction).toBeCalledWith({
                userId,
                coinChargeType,
                coinsToCharge,
            });
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws ChargeCoinsToUserForIncompletingChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getChargeCoinsToUserForIncompletingChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ChargeCoinsToUserForIncompletingChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('chargeOidXpToUserForCompletingChallengeStreakMiddleware', () => {
        test('charges user account with xp for completing challenge streaks', async () => {
            expect.assertions(3);
            const challengeStreakId = '123abc';
            const userId = 'userId';
            const challenge = { _id: '_id', name: 'reading' };
            const createOidXpTransaction = jest.fn(() => Promise.resolve(true));
            const request: any = { body: { challengeStreakId, userId } };
            const response: any = { locals: { challenge } };
            const next = jest.fn();
            const middleware = getChargeOidXpToUserForIncompletingChallengeStreakMiddleware(
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

        test('throws ChargeOidXpToUserForIncompletingChallengeStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getChargeOidXpToUserForIncompletingChallengeStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ChargeOidXpToUserForIncompletingChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendTaskIncompleteResponseMiddleware', () => {
        test('sends incompleteChallengeStreakTask response', () => {
            expect.assertions(3);
            const send = jest.fn(() => true);
            const status = jest.fn(() => ({ send }));
            const incompleteChallengeStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskIncompleteTime: new Date(),
                taskIncompleteDay: '10/05/2019',
            };
            const successResponseCode = 200;
            const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
            const request: any = {};
            const response: any = { locals: { incompleteChallengeStreakTask }, status };
            const next = jest.fn();

            middleware(request, response, next);

            expect(status).toBeCalledWith(successResponseCode);
            expect(send).toBeCalledWith(incompleteChallengeStreakTask);
            expect(next).toBeCalled();
        });

        test('throws SendTaskIncompleteResponseMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const incompleteChallengeStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskIncompleteTime: new Date(),
                taskIncompleteDay: '10/05/2019',
            };
            const successResponseCode = 200;
            const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
            const request: any = {};
            const response: any = { locals: { incompleteChallengeStreakTask } };
            const next = jest.fn();

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createIncompleteChallengeStreakActivitFeedItemMiddleware`, () => {
        test('creates a new incompletedChallengeStreakActivity', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const challengeStreak = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challengeStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateIncompleteChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateIncompleteChallengeStreakActivityMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateIncompleteChallengeStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIncompleteChallengeStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createIncompleteChallengeStreakTaskMiddlewares`, () => {
        test('are defined in the correct order', async () => {
            expect.assertions(17);

            expect(createIncompleteChallengeStreakTaskMiddlewares.length).toEqual(16);
            expect(createIncompleteChallengeStreakTaskMiddlewares[0]).toBe(
                incompleteChallengeStreakTaskBodyValidationMiddleware,
            );
            expect(createIncompleteChallengeStreakTaskMiddlewares[1]).toBe(challengeStreakExistsMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[2]).toBe(
                ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware,
            );
            expect(createIncompleteChallengeStreakTaskMiddlewares[3]).toBe(resetStreakStartDateMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[4]).toBe(retrieveUserMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[5]).toBe(setTaskIncompleteTimeMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[6]).toBe(setDayTaskWasIncompletedMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[7]).toBe(saveTaskIncompleteMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[8]).toBe(incompleteChallengeStreakMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[9]).toBe(
                decreaseTotalStreakCompletesForUserMiddleware,
            );
            expect(createIncompleteChallengeStreakTaskMiddlewares[10]).toBe(retrieveChallengeMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[11]).toBe(
                decreaseTotalTimesTrackedForChallengeStreakMiddleware,
            );
            expect(createIncompleteChallengeStreakTaskMiddlewares[12]).toBe(
                chargeCoinsToUserForIncompletingChallengeStreakMiddleware,
            );
            expect(createIncompleteChallengeStreakTaskMiddlewares[13]).toBe(
                chargeOidXpToUserForIncompletingChallengeStreakMiddleware,
            );
            expect(createIncompleteChallengeStreakTaskMiddlewares[14]).toBe(sendTaskIncompleteResponseMiddleware);
            expect(createIncompleteChallengeStreakTaskMiddlewares[15]).toBe(
                createIncompleteChallengeStreakActivityFeedItemMiddleware,
            );
        });
    });
});
