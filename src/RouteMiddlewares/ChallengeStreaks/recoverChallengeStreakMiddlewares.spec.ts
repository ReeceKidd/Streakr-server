/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import {
    challengeStreakParamsValidationMiddleware,
    getReplaceChallengeStreakCurrentStreakWithLostStreak,
    sendRecoveredChallengeStreakMiddleware,
    getCreateRecoveredChallengeStreakActivityFeedItemMiddleware,
    getCreateRecoveredChallengeStreakTrackingEventMiddleware,
    recoverChallengeStreakMiddlewares,
    retreiveChallengeStreakToRecoverMiddleware,
    replaceChallengeStreakCurrentStreakWithLostStreakMiddleware,
    createRecoveredChallengeStreakActivityFeedItemMiddleware,
    createRecoveredChallengeStreakTrackingEventMiddleware,
    getRetreiveChallengeStreakToRecoverMiddleware,
    createACompleteChallengeStreakTaskForPreviousDayMiddleware,
    getCreateACompleteChallengeStreakTaskForPreviousDayMiddleware,
} from './recoverChallengeStreakMiddlewares';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockChallengeStreak } from '../../testHelpers/getMockChallengeStreak';
import { getMockChallenge } from '../../testHelpers/getMockChallenge';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import moment from 'moment-timezone';

describe('recoverChallengeStreakMiddlewares', () => {
    describe('challengeStreakParamsValidationMiddleware', () => {
        test('sends correct error response when challengeStreakId is not defined', () => {
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

            challengeStreakParamsValidationMiddleware(request, response, next);

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
                params: { challengeStreakId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            challengeStreakParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "challengeStreakId" fails because ["challengeStreakId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retreiveChallengeStreakToRecoverMiddleware', () => {
        test('sets response.locals.challengeStreak and calls next()', async () => {
            expect.assertions(3);
            const challengeStreakId = 'abc';
            const request: any = {
                params: { challengeStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findById };
            const middleware = getRetreiveChallengeStreakToRecoverMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findById).toBeCalledWith(challengeStreakId);
            expect(response.locals.challengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverChallengeStreakChallengeStreakNotFound error when challenge streak does not exist', async () => {
            expect.assertions(1);
            const challengeStreakId = 'abc';
            const request: any = {
                params: { challengeStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findById = jest.fn(() => Promise.resolve(false));
            const challengeStreakModel = { findById };
            const middleware = getRetreiveChallengeStreakToRecoverMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverChallengeStreakChallengeStreakNotFound));
        });

        test('throws RetreiveChallengeStreakToRecoverMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findOne };
            const middleware = getRetreiveChallengeStreakToRecoverMiddleware(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.RetreiveChallengeStreakToRecoverMiddleware, expect.any(Error)),
            );
        });
    });

    describe('replaceChallengeStreakCurrentStreakWithLostStreak', () => {
        test('replaces the current streak with the last lost streak from the past streaks array, makes the streak active and calls next()', async () => {
            expect.assertions(3);
            const challengeStreakId = 'abc';
            const request: any = {
                body: { challengeStreakId },
            };
            const user = getMockUser({ _id: 'userId' });
            const challenge = getMockChallenge();
            const challengeStreak = getMockChallengeStreak({ user, challenge });
            const startDate = new Date().toString();
            const lostStreak: PastStreak = {
                startDate,
                endDate: new Date().toString(),
                numberOfDaysInARow: 10,
            };
            const pastStreaks = [lostStreak];
            const response: any = { locals: { challengeStreak: { ...challengeStreak, pastStreaks, active: false } } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findByIdAndUpdate };
            const middleware = getReplaceChallengeStreakCurrentStreakWithLostStreak(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                challengeStreak._id,
                {
                    $set: {
                        currentStreak: { startDate, numberOfDaysInARow: lostStreak.numberOfDaysInARow },
                        pastStreaks: challengeStreak.pastStreaks,
                        active: true,
                    },
                },
                { new: true },
            );
            expect(response.locals.challengeStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RecoverChallengeStreakChallengeNoLostStreak error when streak has no past streaks.', async () => {
            expect.assertions(1);
            const challengeStreakId = 'abc';
            const request: any = {
                body: { challengeStreakId },
            };
            const user = getMockUser({ _id: 'userId' });
            const challenge = getMockChallenge();
            const challengeStreak = getMockChallengeStreak({ user, challenge });

            const response: any = { locals: { challengeStreak } };
            const next = jest.fn();
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findByIdAndUpdate };
            const middleware = getReplaceChallengeStreakCurrentStreakWithLostStreak(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RecoverChallengeStreakChallengeNoLostStreak));
        });

        test('throws ReplaceChallengeStreakCurrentStreakWithLostStreak error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const challengeStreakModel = { findOne };
            const middleware = getReplaceChallengeStreakCurrentStreakWithLostStreak(challengeStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ReplaceChallengeStreakCurrentStreakWithLostStreak, expect.any(Error)),
            );
        });
    });

    describe('createACompleteChallengeStreakTaskForPreviousDayMiddleware', () => {
        test('creates a complete challenge streak task for previous day and calls next()', async () => {
            expect.assertions(4);

            const save = jest.fn().mockResolvedValue(true);
            const completeChallengeStreakTaskModel = jest.fn(() => ({ save }));
            const getTaskCompleteTimeForYesterday = jest.fn(() => moment().tz('Europe/London'));
            const getTaskCompleteDayFunction = jest.fn(() => new Date().toString());

            const user = getMockUser({ _id: 'userId' });
            const challenge = getMockChallenge();
            const challengeStreak = getMockChallengeStreak({ user, challenge });

            const request: any = {};
            const response: any = { locals: { user, challengeStreak } };
            const next = jest.fn();

            const middleware = getCreateACompleteChallengeStreakTaskForPreviousDayMiddleware(
                completeChallengeStreakTaskModel as any,
                getTaskCompleteTimeForYesterday as any,
                getTaskCompleteDayFunction as any,
            );

            await middleware(request, response, next);

            expect(save).toBeCalled();
            expect(getTaskCompleteTimeForYesterday).toBeCalled();
            expect(getTaskCompleteDayFunction).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws CreateACompleteChallengeStreakTaskForPreviousDayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getCreateACompleteChallengeStreakTaskForPreviousDayMiddleware(
                {} as any,
                {} as any,
                {} as any,
            );

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateACompleteChallengeStreakTaskForPreviousDayMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`createRecoveredChallengeStreakActivityFeedItemMiddleware`, () => {
        test('creates a new recoveredChallengeStreakActivityFeedItem', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: 'userId' });
            const challenge = getMockChallenge();
            const challengeStreak = getMockChallengeStreak({ user, challenge });
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challenge, challengeStreak } };
            const request: any = { params: {}, body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getCreateRecoveredChallengeStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredChallengeStreakActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredChallengeStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredChallengeStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createRecoveredChallengeStreakTrackingEventMiddleware`, () => {
        test('creates a new recovered streak tracking event', async () => {
            expect.assertions(2);
            const user = getMockUser({ _id: 'userId' });
            const challenge = getMockChallenge();
            const challengeStreak = getMockChallengeStreak({ user, challenge });
            const createStreakTrackingEvent = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, challenge, challengeStreak } };
            const request: any = { params: {}, body: { status: StreakStatus.archived } };
            const next = jest.fn();

            const middleware = getCreateRecoveredChallengeStreakTrackingEventMiddleware(
                createStreakTrackingEvent as any,
            );

            await middleware(request, response, next);

            expect(createStreakTrackingEvent).toBeCalled();
            expect(next).toBeCalled();
        });

        test('calls next with CreateRecoveredChallengeStreakTrackingEventMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateRecoveredChallengeStreakTrackingEventMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateRecoveredChallengeStreakTrackingEventMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendRecoveredChallengeStreakMiddleware', () => {
        test('sends updatedChallengeStreak', () => {
            expect.assertions(4);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const user = getMockUser({ _id: 'userId' });
            const challenge = getMockChallenge();
            const challengeStreak = getMockChallengeStreak({ user, challenge });
            const response: any = { locals: { challengeStreak }, status };
            const request: any = {};
            const next = jest.fn();

            sendRecoveredChallengeStreakMiddleware(request, response, next);

            expect(response.locals.user).toBeUndefined();
            expect(status).toBeCalledWith(ResponseCodes.success);
            expect(send).toBeCalledWith(challengeStreak);
            expect(next).not.toBeCalled();
        });

        test('calls next with SendRecoveredChallengeStreakMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            sendRecoveredChallengeStreakMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendRecoveredChallengeStreakMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', () => {
        expect.assertions(8);

        expect(recoverChallengeStreakMiddlewares.length).toBe(7);
        expect(recoverChallengeStreakMiddlewares[0]).toBe(challengeStreakParamsValidationMiddleware);
        expect(recoverChallengeStreakMiddlewares[1]).toBe(retreiveChallengeStreakToRecoverMiddleware);
        expect(recoverChallengeStreakMiddlewares[2]).toBe(replaceChallengeStreakCurrentStreakWithLostStreakMiddleware);
        expect(recoverChallengeStreakMiddlewares[3]).toBe(createACompleteChallengeStreakTaskForPreviousDayMiddleware);
        expect(recoverChallengeStreakMiddlewares[4]).toBe(createRecoveredChallengeStreakActivityFeedItemMiddleware);
        expect(recoverChallengeStreakMiddlewares[5]).toBe(createRecoveredChallengeStreakTrackingEventMiddleware);
        expect(recoverChallengeStreakMiddlewares[6]).toBe(sendRecoveredChallengeStreakMiddleware);
    });
});
