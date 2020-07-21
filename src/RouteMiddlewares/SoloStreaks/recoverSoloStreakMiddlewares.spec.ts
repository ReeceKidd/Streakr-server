/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import {
    soloStreakParamsValidationMiddleware,
    getReplaceSoloStreakCurrentStreakWithLostStreak,
    sendRecoveredSoloStreakMiddleware,
    getCreateRecoveredSoloStreakActivityFeedItemMiddleware,
    getCreateRecoveredSoloStreakTrackingEventMiddleware,
    recoverSoloStreakMiddlewares,
    retreiveSoloStreakToRecoverMiddleware,
    replaceSoloStreakCurrentStreakWithLostStreakMiddleware,
    createRecoveredSoloStreakActivityFeedItemMiddleware,
    createRecoveredSoloStreakTrackingEventMiddleware,
    getRetreiveSoloStreakToRecoverMiddleware,
    createACompleteSoloStreakTaskForPreviousDayMiddleware,
    getCreateACompleteSoloStreakTaskForPreviousDayMiddleware,
    chargeUserCoinsToRecoverSoloStreakMiddleware,
    getChargeUserCoinsToRecoverSoloStreakMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    getIncreaseTotalStreakCompletesForUserMiddleware,
    getIncreaseLongestSoloStreakForUserMiddleware,
    getIncreaseLongestSoloStreakForSoloStreakMiddleware,
    increaseLongestSoloStreakForUserMiddleware,
    increaseLongestSoloStreakForSoloStreakMiddleware,
} from './recoverSoloStreakMiddlewares';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockSoloStreak } from '../../testHelpers/getMockSoloStreak';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import moment from 'moment-timezone';
import { coinChargeValues } from '../../helpers/coinChargeValues';
import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';
import { RecoverSoloStreakCharge } from '@streakoid/streakoid-models/lib/Models/CoinChargeTypes';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { LongestSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestSoloStreak';

describe('recoverSoloStreakMiddlewares', () => {
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

    describe('retreiveSoloStreakToRecoverMiddleware', () => {
        test('sets response.locals.soloStreak and calls next()', async () => {
            expect.assertions(3);
            const soloStreakId = 'abc';
            const request: any = {
                params: { soloStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = { findById };
            const middleware = getRetreiveSoloStreakToRecoverMiddleware(soloStreakModel as any);

            await middleware(request, response, next);

            expect(findById).toBeCalledWith(soloStreakId);
            expect(response.locals.soloStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverSoloStreakSoloStreakNotFound error when solo streak does not exist', async () => {
            expect.assertions(1);
            const soloStreakId = 'abc';
            const request: any = {
                params: { soloStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(false));
            const soloStreakModel = { findById };
            const middleware = getRetreiveSoloStreakToRecoverMiddleware(soloStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverSoloStreakSoloStreakNotFound));
        });

        test('throws RetreiveSoloStreakToRecoverMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = { findOne };
            const middleware = getRetreiveSoloStreakToRecoverMiddleware(soloStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RetreiveSoloStreakToRecoverMiddleware, expect.any(Error)),
            );
        });
    });

    describe('chargeUserCoinsToRecoverSoloStreakMiddleware', () => {
        test('charges user with enough coins to recover solo streak and calls next()', async () => {
            expect.assertions(3);
            const user = { ...getMockUser({ _id: '_id' }), coins: 100000 };

            const soloStreak = getMockSoloStreak({ userId: user._id });

            const request: any = {};
            const response: any = { locals: { user, soloStreak } };
            const next = jest.fn();

            const chargeUserCoins = jest.fn().mockResolvedValue(user);
            const middleware = getChargeUserCoinsToRecoverSoloStreakMiddleware(chargeUserCoins);

            await middleware(request, response, next);

            const coinsToCharge = coinChargeValues[CoinCharges.recoverSoloStreak];
            const coinChargeType: RecoverSoloStreakCharge = {
                coinChargeType: CoinCharges.recoverSoloStreak,
                soloStreakId: soloStreak._id,
            };

            expect(chargeUserCoins).toBeCalledWith({ userId: user._id, coinsToCharge, coinChargeType });
            expect(response.locals.soloStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverSoloStreakUserDoesNotHaveEnoughCoins error when user does not have enough coins', async () => {
            expect.assertions(1);
            const user = getMockUser({ _id: '_id' });
            const soloStreak = getMockSoloStreak({ userId: user._id });

            const request: any = {};
            const response: any = { locals: { user, soloStreak } };
            const next = jest.fn();

            const chargeUserCoins = jest.fn().mockResolvedValue(user);
            const middleware = getChargeUserCoinsToRecoverSoloStreakMiddleware(chargeUserCoins);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverSoloStreakUserDoesNotHaveEnoughCoins));
        });

        test('throws ChargeUserCoinsToRecoverSoloStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getChargeUserCoinsToRecoverSoloStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ChargeUserCoinsToRecoverSoloStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('replaceSoloStreakCurrentStreakWithLostStreak', () => {
        test('replaces the current streak with the last lost streak from the past streaks array, makes the streak active and calls next()', async () => {
            expect.assertions(3);
            const soloStreakId = 'abc';
            const request: any = {
                body: { soloStreakId },
            };
            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({ userId: user._id });
            const startDate = new Date().toString();
            const lostStreak: PastStreak = {
                startDate,
                endDate: new Date().toString(),
                numberOfDaysInARow: 10,
            };
            const pastStreaks = [lostStreak];
            const response: any = { locals: { soloStreak: { ...soloStreak, pastStreaks, active: false } } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = { findByIdAndUpdate };
            const middleware = getReplaceSoloStreakCurrentStreakWithLostStreak(soloStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                soloStreak._id,
                {
                    $set: {
                        currentStreak: { startDate, numberOfDaysInARow: lostStreak.numberOfDaysInARow },
                        pastStreaks: soloStreak.pastStreaks,
                        active: true,
                        totalTimesTracked: soloStreak.totalTimesTracked + 1,
                    },
                },
                { new: true },
            );
            expect(response.locals.soloStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverSoloStreakSoloNoLostStreak error when streak has no past streaks.', async () => {
            expect.assertions(1);
            const soloStreakId = 'abc';
            const request: any = {
                body: { soloStreakId },
            };
            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({ userId: user._id });

            const response: any = { locals: { soloStreak } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = { findByIdAndUpdate };
            const middleware = getReplaceSoloStreakCurrentStreakWithLostStreak(soloStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverSoloStreakSoloNoLostStreak));
        });

        test('throws ReplaceSoloStreakCurrentStreakWithLostStreak error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = { findOne };
            const middleware = getReplaceSoloStreakCurrentStreakWithLostStreak(soloStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ReplaceSoloStreakCurrentStreakWithLostStreak, expect.any(Error)),
            );
        });
    });

    describe('increaseTotalStreakCompletesForUserMiddleware', () => {
        test('increases the total streak completes for a user by one and calls next()', async () => {
            expect.assertions(3);

            const user = getMockUser({ _id: 'userId' });
            const findByIdAndUpdate = jest.fn().mockResolvedValue(user);
            const userModel = {
                findByIdAndUpdate,
            };
            const request: any = {};
            const response: any = { locals: { user } };
            const next = jest.fn();

            const middleware = getIncreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $inc: {
                        totalStreakCompletes: 1,
                    },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseTotalStreakCompletesForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getIncreaseTotalStreakCompletesForUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IncreaseTotalStreakCompletesForUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('increaseLongestSoloStreakForUserMiddleware', () => {
        test('increases longest solo streak for user when the current solo streak is longer than the users longestSoloStreak and calls next', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const soloStreak: SoloStreak = {
                ...getMockSoloStreak({ userId: user._id }),
                currentStreak: {
                    numberOfDaysInARow: 1,
                    startDate: new Date().toString(),
                    endDate: '',
                },
            };

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    soloStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestSoloStreakForUserMiddleware({ userModel });

            await middleware(request, response, next);

            const longestSoloStreak: LongestSoloStreak = {
                soloStreakId: soloStreak._id,
                soloStreakName: soloStreak.streakName,
                numberOfDays: soloStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(soloStreak.createdAt),
            };

            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { longestSoloStreak },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('if current streak is not longer than the users longestSoloStreak just call next.', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const soloStreak: SoloStreak = getMockSoloStreak({
                userId: user._id,
            });

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    soloStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestSoloStreakForUserMiddleware({ userModel });

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseLongestSoloStreakForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseLongestSoloStreakForUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RecoverSoloStreakIncreaseLongestSoloStreakForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseLongestSoloStreakForSoloStreakMiddleware', () => {
        test('increases longest solo streak for soloStreak when the current solo streak is longer than the soloStreaks longestSoloStreak and calls next', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const soloStreak: SoloStreak = {
                ...getMockSoloStreak({ userId: user._id }),
                currentStreak: {
                    numberOfDaysInARow: 1,
                    startDate: new Date().toString(),
                    endDate: '',
                },
            };

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    soloStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestSoloStreakForSoloStreakMiddleware({
                soloStreakModel,
            });

            await middleware(request, response, next);

            const longestSoloStreak: LongestSoloStreak = {
                soloStreakId: soloStreak._id,
                soloStreakName: soloStreak.streakName,
                numberOfDays: soloStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(soloStreak.createdAt),
            };

            expect(findByIdAndUpdate).toBeCalledWith(
                soloStreak._id,
                {
                    $set: { longestSoloStreak },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('if current streak is not longer than the challenge streaks longestSoloStreak just call next.', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({
                userId: user._id,
            });

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const soloStreakModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    soloStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestSoloStreakForSoloStreakMiddleware({
                soloStreakModel,
            });

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseLongestSoloStreakForSoloStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseLongestSoloStreakForSoloStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RecoverSoloStreakIncreaseLongestSoloStreakForSoloStreakMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('createACompleteSoloStreakTaskForPreviousDayMiddleware', () => {
        test('creates a complete solo streak task for previous day and calls next()', async () => {
            expect.assertions(4);

            const save = jest.fn().mockResolvedValue(true);
            const completeSoloStreakTaskModel = jest.fn(() => ({ save }));
            const getTaskCompleteTimeForYesterday = jest.fn(() => moment().tz('Europe/London'));
            const getTaskCompleteDayFunction = jest.fn(() => new Date().toString());

            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({ userId: user._id });

            const request: any = {};
            const response: any = { locals: { user, soloStreak } };
            const next = jest.fn();

            const middleware = getCreateACompleteSoloStreakTaskForPreviousDayMiddleware(
                completeSoloStreakTaskModel as any,
                getTaskCompleteTimeForYesterday as any,
                getTaskCompleteDayFunction as any,
            );

            await middleware(request, response, next);

            expect(save).toBeCalled();
            expect(getTaskCompleteTimeForYesterday).toBeCalled();
            expect(getTaskCompleteDayFunction).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws CreateACompleteSoloStreakTaskForPreviousDayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getCreateACompleteSoloStreakTaskForPreviousDayMiddleware(
                {} as any,
                {} as any,
                {} as any,
            );

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateACompleteSoloStreakTaskForPreviousDayMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRecoveredSoloStreakActivityFeedItemMiddleware`, () => {
        test('creates a new recoveredSoloStreakActivityFeedItem', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({ userId: user._id });
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, soloStreak } };
            const request: any = { params: {}, body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getCreateRecoveredSoloStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredSoloStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredSoloStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredSoloStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRecoveredSoloStreakTrackingEventMiddleware`, () => {
        test('creates a new recovered streak tracking event', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({ userId: user._id });
            const createStreakTrackingEvent = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, soloStreak } };
            const request: any = { params: {}, body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getCreateRecoveredSoloStreakTrackingEventMiddleware(createStreakTrackingEvent as any);

            await middleware(request, response, next);

            expect(createStreakTrackingEvent).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredSoloStreakTrackingEventMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredSoloStreakTrackingEventMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredSoloStreakTrackingEventMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendRecoveredSoloStreakMiddleware', () => {
        test('sends updatedSoloStreak', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const user = getMockUser({ _id: 'userId' });
            const soloStreak = getMockSoloStreak({ userId: user._id });
            const response: any = { locals: { soloStreak }, status };
            const request: any = {};
            const next = jest.fn();

            sendRecoveredSoloStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(status).toBeCalledWith(ResponseCodes.success);
            expect(send).toBeCalledWith(soloStreak);
            expect(next).not.toBeCalled();
        });

        test('calls next with SendRecoveredSoloStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendRecoveredSoloStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendRecoveredSoloStreakMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(12);

        expect(recoverSoloStreakMiddlewares.length).toBe(11);
        expect(recoverSoloStreakMiddlewares[0]).toBe(soloStreakParamsValidationMiddleware);
        expect(recoverSoloStreakMiddlewares[1]).toBe(retreiveSoloStreakToRecoverMiddleware);
        expect(recoverSoloStreakMiddlewares[2]).toBe(chargeUserCoinsToRecoverSoloStreakMiddleware);
        expect(recoverSoloStreakMiddlewares[3]).toBe(replaceSoloStreakCurrentStreakWithLostStreakMiddleware);
        expect(recoverSoloStreakMiddlewares[4]).toBe(increaseTotalStreakCompletesForUserMiddleware);
        expect(recoverSoloStreakMiddlewares[5]).toBe(increaseLongestSoloStreakForUserMiddleware);
        expect(recoverSoloStreakMiddlewares[6]).toBe(increaseLongestSoloStreakForSoloStreakMiddleware);
        expect(recoverSoloStreakMiddlewares[7]).toBe(createACompleteSoloStreakTaskForPreviousDayMiddleware);
        expect(recoverSoloStreakMiddlewares[8]).toBe(createRecoveredSoloStreakActivityFeedItemMiddleware);
        expect(recoverSoloStreakMiddlewares[9]).toBe(createRecoveredSoloStreakTrackingEventMiddleware);
        expect(recoverSoloStreakMiddlewares[10]).toBe(sendRecoveredSoloStreakMiddleware);
    });
});
