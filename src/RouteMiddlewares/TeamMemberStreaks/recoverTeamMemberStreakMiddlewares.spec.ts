/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    teamMemberStreakParamsValidationMiddleware,
    getRecoverTeamMemberStreakMiddleware,
    sendRecoveredTeamMemberStreakMiddleware,
    getCreateRecoveredTeamMemberStreakActivityFeedItemMiddleware,
    getCreateRecoveredTeamMemberStreakTrackingEventMiddleware,
    recoverTeamMemberStreakMiddlewares,
    retreiveTeamMemberStreakToRecoverMiddleware,
    retrieveTeamStreakToRecoverMiddleware,
    getRetrieveTeamStreakToRecoverMiddleware,
    recoverTeamMemberStreakMiddleware,
    createRecoveredTeamMemberStreakActivityFeedItemMiddleware,
    createRecoveredTeamMemberStreakTrackingEventMiddleware,
    getRetreiveTeamMemberStreakToRecoverMiddleware,
    createACompleteTeamMemberStreakTaskForPreviousDayMiddleware,
    getCreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware,
    chargeUserCoinsToRecoverTeamMemberStreakMiddleware,
    getChargeUserCoinsToRecoverTeamMemberStreakMiddleware,
    shouldTeamStreakBeRecoveredMiddleware,
    recoverTeamStreakMiddleware,
    createRecoveredTeamStreakActivityFeedItemMiddleware,
    createRecoveredTeamStreakTrackingEventMiddleware,
    getCreateRecoveredTeamStreakActivityFeedItemMiddleware,
    getCreateRecoveredTeamStreakTrackingEventMiddleware,
    getRecoverTeamStreakMiddleware,
    getShouldTeamStreakBeRecoveredMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    getIncreaseTotalStreakCompletesForUserMiddleware,
    getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
    increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
    getIncreaseLongestTeamMemberStreakForUserMiddleware,
    increaseLongestTeamMemberStreakForUserMiddleware,
} from './recoverTeamMemberStreakMiddlewares';

import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import moment from 'moment-timezone';
import { coinChargeValues } from '../../helpers/coinChargeValues';
import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';
import { RecoverTeamMemberStreakCharge } from '@streakoid/streakoid-models/lib/Models/CoinChargeTypes';
import { LongestTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamMemberStreak';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';

describe('recoverTeamMemberStreakMiddlewares', () => {
    describe('teamMemberStreakParamsValidationMiddleware', () => {
        test('sends correct error response when teamMemberStreakId is not defined', () => {
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

            teamMemberStreakParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when teamMemberStreakId is not a string', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { teamMemberStreakId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            teamMemberStreakParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retreiveTeamMemberStreakToRecoverMiddleware', () => {
        test('sets response.locals.teamMemberStreak and calls next()', async () => {
            expect.assertions(3);
            const teamMemberStreakId = 'abc';
            const request: any = {
                params: { teamMemberStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findById };
            const middleware = getRetreiveTeamMemberStreakToRecoverMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findById).toBeCalledWith(teamMemberStreakId);
            expect(response.locals.teamMemberStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverTeamMemberStreakTeamMemberStreakNotFound error when team member streak does not exist', async () => {
            expect.assertions(1);
            const teamMemberStreakId = 'abc';
            const request: any = {
                params: { teamMemberStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(false));
            const teamMemberStreakModel = { findById };
            const middleware = getRetreiveTeamMemberStreakToRecoverMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverTeamMemberStreakTeamMemberStreakNotFound));
        });

        test('throws RetreiveTeamMemberStreakToRecoverMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetreiveTeamMemberStreakToRecoverMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RetreiveTeamMemberStreakToRecoverMiddleware, expect.any(Error)),
            );
        });
    });

    describe('retrieveTeamStreakToRecoverMiddleware', () => {
        test('sets response.locals.teamStreak and calls next()', async () => {
            expect.assertions(3);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = { findById };
            const middleware = getRetrieveTeamStreakToRecoverMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findById).toBeCalledWith(teamMemberStreak.teamStreakId);
            expect(response.locals.teamStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverTeamStreakTeamStreakNotFound error when team streak does not exist', async () => {
            expect.assertions(1);

            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(false));
            const teamMemberStreakModel = { findById };
            const middleware = getRetrieveTeamStreakToRecoverMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverTeamMemberStreakTeamStreakNotFound));
        });

        test('throws RetrieveTeamStreakToRecoverMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveTeamStreakToRecoverMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RetrieveTeamStreakToRecoverMiddleware, expect.any(Error)),
            );
        });
    });

    describe('chargeUserCoinsToRecoverTeamMemberStreakMiddleware', () => {
        test('charges user with enough coins to recover challenge streak and calls next()', async () => {
            expect.assertions(3);
            const user = { ...getMockUser({ _id: '_id' }), coins: 100000 };
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });

            const request: any = {};
            const response: any = { locals: { user, teamStreak, teamMemberStreak } };
            const next = jest.fn();

            const chargeUserCoins = jest.fn().mockResolvedValue(user);
            const middleware = getChargeUserCoinsToRecoverTeamMemberStreakMiddleware(chargeUserCoins);

            await middleware(request, response, next);

            const coinsToCharge = coinChargeValues[CoinCharges.recoverTeamMemberStreak];
            const coinChargeType: RecoverTeamMemberStreakCharge = {
                coinChargeType: CoinCharges.recoverTeamMemberStreak,
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
            };

            expect(chargeUserCoins).toBeCalledWith({ userId: user._id, coinsToCharge, coinChargeType });
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverTeamMemberStreakUserDoesNotHaveEnoughCoins error when user does not have enough coins', async () => {
            expect.assertions(1);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });

            const request: any = {};
            const response: any = { locals: { user, teamStreak, teamMemberStreak } };
            const next = jest.fn();

            const chargeUserCoins = jest.fn().mockResolvedValue(user);
            const middleware = getChargeUserCoinsToRecoverTeamMemberStreakMiddleware(chargeUserCoins);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverTeamMemberStreakUserDoesNotHaveEnoughCoins));
        });

        test('throws ChargeUserCoinsToRecoverTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getChargeUserCoinsToRecoverTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ChargeUserCoinsToRecoverTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('recoverTeamMemberStreakMiddleware', () => {
        test('replaces the current team member streak with the last lost streak from the past streaks array, makes the team member streak active and calls next()', async () => {
            expect.assertions(3);
            const request: any = {};
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });
            const startDate = new Date().toString();
            const lostStreak: PastStreak = {
                startDate,
                endDate: new Date().toString(),
                numberOfDaysInARow: 10,
            };
            const pastStreaks = [lostStreak];
            const response: any = { locals: { teamMemberStreak: { ...teamMemberStreak, pastStreaks, active: false } } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findByIdAndUpdate };
            const middleware = getRecoverTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamMemberStreak._id,
                {
                    $set: {
                        currentStreak: { startDate, numberOfDaysInARow: lostStreak.numberOfDaysInARow },
                        pastStreaks: teamMemberStreak.pastStreaks,
                        active: true,
                        totalTimesTracked: teamMemberStreak.totalTimesTracked + 1,
                    },
                },
                { new: true },
            );
            expect(response.locals.teamMemberStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverTeamMemberStreakChallengeNoLostStreak error when streak has no past streaks.', async () => {
            expect.assertions(1);
            const teamMemberStreakId = 'abc';
            const request: any = {
                body: { teamMemberStreakId },
            };
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = {
                ...getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id }),
                pastStreaks: [],
            };

            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findByIdAndUpdate };
            const middleware = getRecoverTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverTeamMemberStreakNoLostStreak));
        });

        test('throws RecoverTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findOne };
            const middleware = getRecoverTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RecoverTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('shouldTeamStreakBeRecoveredMiddleware', () => {
        test('sets response.locals.teamStreakShouldBeRecovered to true if all team members have an active streak and calls next()', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const find = jest.fn(() =>
                Promise.resolve([{ ...teamMemberStreak, active: true }, { ...teamMemberStreak, active: true }]),
            );
            const teamStreakModel = { find };
            const middleware = getShouldTeamStreakBeRecoveredMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(find).toBeCalledWith({ _id: teamStreak.members.map(member => member.teamMemberStreakId) });
            expect(next).toBeCalledWith();
        });

        test('sets response.locals.teamStreakShouldBeRecovered to false if any of the team members have an inactive streak and calls next()', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const find = jest.fn(() =>
                Promise.resolve([{ ...teamMemberStreak, active: true }, { ...teamMemberStreak, active: false }]),
            );
            const teamStreakModel = { find };
            const middleware = getShouldTeamStreakBeRecoveredMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(find).toBeCalledWith({ _id: teamStreak.members.map(member => member.teamMemberStreakId) });
            expect(next).toBeCalledWith();
        });

        test('throws RetrieveTeamStreakToRecoverMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getShouldTeamStreakBeRecoveredMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ShouldTeamStreakBeRecoveredMiddleware, expect.any(Error)),
            );
        });
    });

    describe('recoverTeamStreakMiddleware', () => {
        test('if response.locals.teamStreakShouldBeRecovered is true it replaces the current team streak with the last lost streak from the past streaks array, makes the team streak active and calls next()', async () => {
            expect.assertions(3);
            const request: any = {};
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const startDate = new Date().toString();
            const lostStreak: PastStreak = {
                startDate,
                endDate: new Date().toString(),
                numberOfDaysInARow: 10,
            };
            const pastStreaks = [lostStreak];
            const teamStreakShouldBeRecovered = true;
            const response: any = {
                locals: { teamStreak: { ...teamStreak, pastStreaks, active: false }, teamStreakShouldBeRecovered },
            };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findByIdAndUpdate };
            const middleware = getRecoverTeamStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamStreak._id,
                {
                    $set: {
                        currentStreak: { startDate, numberOfDaysInARow: lostStreak.numberOfDaysInARow },
                        pastStreaks: teamStreak.pastStreaks,
                        active: true,
                        totalTimesTracked: teamStreak.totalTimesTracked + 1,
                    },
                },
                { new: true },
            );
            expect(response.locals.teamStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('if response.locals.teamStreakShouldBeRecovered is false it just calls next()', async () => {
            expect.assertions(2);
            const request: any = {};
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamStreakShouldBeRecovered = false;
            const response: any = {
                locals: { teamStreak, teamStreakShouldBeRecovered },
            };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findByIdAndUpdate };
            const middleware = getRecoverTeamStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverTeamStreakNoLostStreak error when response.locals.teamStreakShouldBeRecovered is true and streak has no past streaks.', async () => {
            expect.assertions(1);

            const request: any = {};
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamStreakShouldBeRecovered = true;

            const response: any = { locals: { teamStreak, teamStreakShouldBeRecovered } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findByIdAndUpdate };
            const middleware = getRecoverTeamStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverTeamStreakNoLostStreak));
        });

        test('throws RecoverTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findOne };
            const middleware = getRecoverTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RecoverTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('increaseTotalStreakCompletesForUserMiddleware', () => {
        test('increments totalStreakCompletes on user by one and calls next', async () => {
            expect.assertions(3);
            const user = getMockUser({ _id: 'userId' });
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
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
                    $inc: { totalStreakCompletes: 1 },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverTeamMemberStreakIncreaseTotalStreakCompletesForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RecoverTeamMemberStreakIncreaseTotalStreakCompletesForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseLongestTeamMemberStreakForUserMiddleware', () => {
        test('increases longest team member streak for user when the current team member streak is longer than the users longestTeamMemberStreak and calls next', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak: TeamMemberStreak = {
                ...getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id }),
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
                    teamMemberStreak,
                    teamStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForUserMiddleware({ userModel });

            await middleware(request, response, next);

            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };

            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('if current streak is not longer than the users longestTeamMemberStreak just call next.', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak: TeamMemberStreak = getMockTeamMemberStreak({
                userId: user._id,
                teamStreakId: teamStreak._id,
            });

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    teamMemberStreak,
                    teamStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForUserMiddleware({ userModel });

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseLongestTeamMemberStreakForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware', () => {
        test('increases longest team member streak for teamMemberStreak when the current team member streak is longer than the teamMemberStreaks longestTeamMemberStreak and calls next', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak: TeamMemberStreak = {
                ...getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id }),
                currentStreak: {
                    numberOfDaysInARow: 1,
                    startDate: new Date().toString(),
                    endDate: '',
                },
            };

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    teamMemberStreak,
                    teamStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware({
                teamMemberStreakModel,
            });

            await middleware(request, response, next);

            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };

            expect(findByIdAndUpdate).toBeCalledWith(
                teamMemberStreak._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('if current streak is not longer than the challenge streaks longestTeamMemberStreak just call next.', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({
                userId: user._id,
                teamStreakId: teamStreak._id,
            });

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    teamMemberStreak,
                    teamStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware({
                teamMemberStreakModel,
            });

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('increaseLongestTeamStreakForTeamStreakMembersMiddleware', () => {
        test('increases longest team streak for each of the team streak members when the current team member streak is longer than the teamMemberStreaks longestTeamMemberStreak and calls next', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak: TeamMemberStreak = {
                ...getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id }),
                currentStreak: {
                    numberOfDaysInARow: 1,
                    startDate: new Date().toString(),
                    endDate: '',
                },
            };

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    teamMemberStreak,
                    teamStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware({
                teamMemberStreakModel,
            });

            await middleware(request, response, next);

            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };

            expect(findByIdAndUpdate).toBeCalledWith(
                teamMemberStreak._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('if current streak is not longer than the challenge streaks longestTeamMemberStreak just call next.', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({
                userId: user._id,
                teamStreakId: teamStreak._id,
            });

            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                findByIdAndUpdate,
            } as any;
            const request: any = {};
            const response: any = {
                locals: {
                    teamMemberStreak,
                    teamStreak,
                    user,
                },
            };
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware({
                teamMemberStreakModel,
            });

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws IncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('createACompleteTeamMemberStreakTaskForPreviousDayMiddleware', () => {
        test('creates a complete challenge streak task for previous day and calls next()', async () => {
            expect.assertions(4);

            const save = jest.fn().mockResolvedValue(true);
            const completeTeamMemberStreakTaskModel = jest.fn(() => ({ save }));
            const getTaskCompleteTimeForYesterday = jest.fn(() => moment().tz('Europe/London'));
            const getTaskCompleteDayFunction = jest.fn(() => new Date().toString());

            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });

            const request: any = {};
            const response: any = { locals: { user, teamMemberStreak } };
            const next = jest.fn();

            const middleware = getCreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware(
                completeTeamMemberStreakTaskModel as any,
                getTaskCompleteTimeForYesterday as any,
                getTaskCompleteDayFunction as any,
            );

            await middleware(request, response, next);

            expect(save).toBeCalled();
            expect(getTaskCompleteTimeForYesterday).toBeCalled();
            expect(getTaskCompleteDayFunction).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws CreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getCreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware(
                {} as any,
                {} as any,
                {} as any,
            );

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`createRecoveredTeamMemberStreakActivityFeedItemMiddleware`, () => {
        test('creates a new recoveredTeamMemberStreakActivityFeedItem', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak, teamMemberStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateRecoveredTeamMemberStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredTeamMemberStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredTeamMemberStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredTeamMemberStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRecoveredTeamMemberStreakActivityFeedItemMiddleware`, () => {
        test('creates a new recoveredTeamStreakActivityFeedItem if response.locals.teamStreakShouldBeRecovered is set to true.', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamStreakShouldBeRecovered = true;
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak, teamStreakShouldBeRecovered } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateRecoveredTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('just calls next if response.locals.teamStreakShouldBeRecovered is set to false.', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamStreakShouldBeRecovered = false;
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak, teamStreakShouldBeRecovered } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateRecoveredTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).not.toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredTeamStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredTeamStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredTeamStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRecoveredTeamMemberStreakTrackingEventMiddleware`, () => {
        test('creates a new recovered streak tracking event', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ userId: user._id, teamStreakId: teamStreak._id });

            const createStreakTrackingEvent = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak, teamMemberStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateRecoveredTeamMemberStreakTrackingEventMiddleware(
                createStreakTrackingEvent as any,
            );

            await middleware(request, response, next);

            expect(createStreakTrackingEvent).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredTeamMemberStreakTrackingEventMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredTeamMemberStreakTrackingEventMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredTeamMemberStreakTrackingEventMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRecoveredTeamStreakTrackingEventMiddleware`, () => {
        test('creates a new recovered streak tracking event if response.locals.teamStreakShouldBeRecovered is set to true', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamStreakShouldBeRecovered = true;

            const createStreakTrackingEvent = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak, teamStreakShouldBeRecovered } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateRecoveredTeamStreakTrackingEventMiddleware(createStreakTrackingEvent as any);

            await middleware(request, response, next);

            expect(createStreakTrackingEvent).toBeCalled();
            expect(next).toBeCalled();
        });

        test('does not creates a new recovered streak tracking event if response.locals.teamStreakShouldBeRecovered is set to false', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamStreakShouldBeRecovered = true;

            const createStreakTrackingEvent = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak, teamStreakShouldBeRecovered } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateRecoveredTeamStreakTrackingEventMiddleware(createStreakTrackingEvent as any);

            await middleware(request, response, next);

            expect(createStreakTrackingEvent).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredTeamStreakTrackingEventMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredTeamStreakTrackingEventMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredTeamStreakTrackingEventMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendRecoveredTeamMemberStreakMiddleware', () => {
        test('sends updatedTeamMemberStreak', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));

            const user = getMockUser({ _id: '_id' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const teamMemberStreak = getMockTeamMemberStreak({ teamStreakId: teamStreak._id, userId: user._id });
            const response: any = { locals: { teamMemberStreak }, status };
            const request: any = {};
            const next = jest.fn();

            sendRecoveredTeamMemberStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(status).toBeCalledWith(ResponseCodes.success);
            expect(send).toBeCalledWith(teamMemberStreak);
            expect(next).not.toBeCalled();
        });

        test('calls next with SendRecoveredTeamMemberStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendRecoveredTeamMemberStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendRecoveredTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(17);

        expect(recoverTeamMemberStreakMiddlewares.length).toBe(16);
        expect(recoverTeamMemberStreakMiddlewares[0]).toBe(teamMemberStreakParamsValidationMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[1]).toBe(retreiveTeamMemberStreakToRecoverMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[2]).toBe(retrieveTeamStreakToRecoverMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[3]).toBe(chargeUserCoinsToRecoverTeamMemberStreakMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[4]).toBe(recoverTeamMemberStreakMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[5]).toBe(shouldTeamStreakBeRecoveredMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[6]).toBe(recoverTeamStreakMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[7]).toBe(increaseTotalStreakCompletesForUserMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[8]).toBe(increaseLongestTeamMemberStreakForUserMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[9]).toBe(
            increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
        );
        expect(recoverTeamMemberStreakMiddlewares[10]).toBe(
            createACompleteTeamMemberStreakTaskForPreviousDayMiddleware,
        );
        expect(recoverTeamMemberStreakMiddlewares[11]).toBe(createRecoveredTeamMemberStreakActivityFeedItemMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[12]).toBe(createRecoveredTeamStreakActivityFeedItemMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[13]).toBe(createRecoveredTeamMemberStreakTrackingEventMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[14]).toBe(createRecoveredTeamStreakTrackingEventMiddleware);
        expect(recoverTeamMemberStreakMiddlewares[15]).toBe(sendRecoveredTeamMemberStreakMiddleware);
    });
});
