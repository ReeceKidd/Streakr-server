/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createIncompleteTeamMemberStreakTaskMiddlewares,
    retrieveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteTeamMemberStreakTaskDefinitionMiddleware,
    teamMemberStreakExistsMiddleware,
    saveTaskIncompleteMiddleware,
    getIncompleteTeamMemberStreakMiddleware,
    getTeamMemberStreakExistsMiddleware,
    getRetrieveUserMiddleware,
    getSetDayTaskWasIncompletedMiddleware,
    getSetTaskIncompleteTimeMiddleware,
    getSaveTaskIncompleteMiddleware,
    incompleteTeamMemberStreakMiddleware,
    getSendTaskIncompleteResponseMiddleware,
    incompleteTeamMemberStreakTaskBodyValidationMiddleware,
    ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    getResetStreakStartDateMiddleware,
    resetTeamStreakStartDateMiddleware,
    incompleteTeamStreakMiddleware,
    createTeamStreakIncompleteMiddleware,
    teamStreakExistsMiddleware,
    getTeamStreakExistsMiddleware,
    getResetTeamStreakStartDateMiddleware,
    getIncompleteTeamStreakMiddleware,
    getCreateTeamStreakIncompleteMiddleware,
    retrieveTeamMembersMiddleware,
    notifiyTeamMembersThatUserHasIncompletedTaskMiddleware,
    getRetrieveTeamMembersMiddleware,
    getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware,
    getCreateIncompleteTeamMemberStreakActivityFeedItemMiddleware,
    createIncompleteTeamMemberStreakActivityFeedItemMiddleware,
    decreaseTotalStreakCompletesForUserMiddleware,
    getDecreaseTotalStreakCompletesForUserMiddleware,
    decreaseTotalTimesTrackedForTeamMemberStreakMiddleware,
    chargeCoinsToUserForIncompletingTeamMemberStreakMiddleware,
    chargeOidXpToUserForIncompletingTeamMemberStreakMiddleware,
    getDecreaseTotalTimesTrackedForTeamMemberStreakMiddleware,
    getChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware,
    getChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware,
    getDecreaseTotalTimesTrackedForTeamStreakMiddleware,
    decreaseTotalTimesTrackedForTeamStreakMiddleware,
} from './createIncompleteTeamMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { getMockUser } from '../../testHelpers/getMockUser';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { CoinSourcesTypes } from '@streakoid/streakoid-models/lib/Types/CoinSourcesTypes';
import { coinValues } from '../../helpers/coinValues';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { oidXpValues } from '../../helpers/oidXpValues';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';

describe('createIncompleteTeamMemberStreakTaskMiddlewares', () => {
    describe(`incompleteTeamMemberStreakTaskBodyValidationMiddleware`, () => {
        const userId = 'userId';
        const teamMemberStreakId = '123456';
        const teamStreakId = 'teamStreakId';

        const body = {
            userId,
            teamMemberStreakId,
            teamStreakId,
        };

        test('calls next() when correct body is supplied', () => {
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

            incompleteTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(next).toBeCalled();
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

            incompleteTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when teamMemberStreakId is missing', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, teamMemberStreakId: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            incompleteTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

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
                body: { ...body, teamMemberStreakId: 1234 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            incompleteTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct error response when teamStreakId is missing', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { ...body, teamStreakId: undefined },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            incompleteTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('teamMemberStreakExistsMiddleware', () => {
        test('sets response.locals.teamMemberStreak and calls next()', async () => {
            expect.assertions(3);
            const teamMemberStreakId = 'abc';
            const request: any = {
                body: { teamMemberStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findOne };
            const middleware = getTeamMemberStreakExistsMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: teamMemberStreakId });
            expect(response.locals.teamMemberStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist error when solo streak does not exist', async () => {
            expect.assertions(1);
            const teamMemberStreakId = 'abc';
            const request: any = {
                body: { teamMemberStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(false));
            const teamMemberStreakModel = { findOne };
            const middleware = getTeamMemberStreakExistsMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist),
            );
        });

        test('throws CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findOne };
            const middleware = getTeamMemberStreakExistsMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('teamStreakExistsMiddleware', () => {
        test('sets response.locals.teamStreak and calls next()', async () => {
            expect.assertions(3);
            const teamStreakId = 'abc';
            const request: any = {
                body: { teamStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = { findOne };
            const middleware = getTeamStreakExistsMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: teamStreakId });
            expect(response.locals.teamStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist error when solo streak does not exist', async () => {
            expect.assertions(1);
            const teamStreakId = 'abc';
            const request: any = {
                body: { teamStreakId },
            };
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(false));
            const teamStreakModel = { findOne };
            const middleware = getTeamStreakExistsMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist),
            );
        });

        test('throws CreateIncompleteTeamMemberStreakTaskTeamStreakExistsMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getTeamStreakExistsMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware', () => {
        test('if teamMemberStreak.completedToday is true it calls next middleware', () => {
            const teamMemberStreak = {
                completedToday: true,
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();

            ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('if teamMemberStreak.completedToday is false it throws TeamMemberStreakHasNotBeenCompletedToday error message', () => {
            const teamMemberStreak = {
                completedToday: false,
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();

            ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamMemberStreakHasNotBeenCompletedToday));
        });

        test('throws EnsureTeamMemberStreakTaskHasBeeenCompletedTodayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.EnsureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware, expect.any(Error)),
            );
        });
    });

    describe('resetStreakStartDateMiddleware', () => {
        test('if currentStreak number of days is 1 and this is the first streak it resets the current streak', async () => {
            expect.assertions(3);
            const lean = jest.fn(() => true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const teamMemberStreakModel: any = {
                findByIdAndUpdate,
            };
            const teamMemberStreakId = 1;
            const teamMemberStreak = {
                _id: teamMemberStreakId,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 1,
                },
                pastStreaks: [],
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next: any = jest.fn();
            const middleware = await getResetStreakStartDateMiddleware(teamMemberStreakModel);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamMemberStreakId,
                {
                    currentStreak: { startDate: null, numberOfDaysInARow: 0 },
                },
                { new: true },
            );
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test("doesn't update teamMemberStreak in number of days in a row > 1", async () => {
            expect.assertions(2);
            const findByIdAndUpdate = jest.fn();
            const teamMemberStreakModel: any = {
                findByIdAndUpdate,
            };
            const teamMemberStreakId = 2;
            const teamMemberStreak = {
                currentStreak: {
                    startDate: new Date(),
                    numberOfDaysInARow: 2,
                },
            };
            const request: any = { params: { teamMemberStreakId } };
            const response: any = { locals: { teamMemberStreak } };
            const next: any = jest.fn();
            const middleware = await getResetStreakStartDateMiddleware(teamMemberStreakModel);

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

        test('throws CreateIncompleteTeamMemberStreakTaskUserDoesNotExist when user does not exist', async () => {
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

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskUserDoesNotExist),
            );
        });

        test('throws CreateIncompleteTeamMemberStreakTaskRetrieveUserMiddleware error on middleware failure', async () => {
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
                new CustomError(
                    ErrorType.CreateIncompleteTeamMemberStreakTaskRetrieveUserMiddleware,
                    expect.any(Error),
                ),
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

    describe('createIncompleteTeamMemberStreakTaskDefinitionMiddleware', () => {
        test('sets incompleteTeamMemberStreakTaskDefinition and calls next()', () => {
            expect.assertions(3);
            const teamMemberStreakId = 'abcd123';
            const teamStreakId = 'teamStreakId';
            const toDate = jest.fn(() => '27/03/2019');
            const taskIncompleteTime = {
                toDate,
            };
            const taskIncompleteDay = '09/05/2019';
            const userId = 'abc';
            const request: any = {
                body: { userId, teamMemberStreakId, teamStreakId },
            };
            const response: any = {
                locals: {
                    taskIncompleteTime,
                    taskIncompleteDay,
                },
            };
            const next = jest.fn();

            createIncompleteTeamMemberStreakTaskDefinitionMiddleware(request, response, next);

            expect(response.locals.incompleteTeamMemberStreakTaskDefinition).toEqual({
                userId,
                teamMemberStreakId,
                taskIncompleteTime: taskIncompleteTime.toDate(),
                taskIncompleteDay,
                teamStreakId,
            });
            expect(toDate).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            createIncompleteTeamMemberStreakTaskDefinitionMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`saveTaskIncompleteMiddleware`, () => {
        test('sets response.locals.incompleteTeamMemberStreakTask and calls next', async () => {
            expect.assertions(3);
            const userId = 'abcd';
            const streakId = '1234';
            const taskIncompleteTime = new Date();
            const taskIncompleteDay = '09/05/2019';
            const incompleteTeamMemberStreakTaskDefinition = {
                userId,
                streakId,
                taskIncompleteTime,
                taskIncompleteDay,
            };
            const save = jest.fn(() => Promise.resolve(true));
            class IncompleteTeamMemberStreakTaskModel {
                userId: string;
                streakId: string;
                taskIncompleteTime: Date;
                taskIncompleteDay: string;

                constructor(userId: string, streakId: string, taskIncompleteTime: Date, taskIncompleteDay: string) {
                    this.userId = userId;
                    (this.streakId = streakId), (this.taskIncompleteTime = taskIncompleteTime);
                    this.taskIncompleteDay = taskIncompleteDay;
                }

                save() {
                    return save();
                }
            }
            const request: any = {};
            const response: any = { locals: { incompleteTeamMemberStreakTaskDefinition } };
            const next = jest.fn();
            const middleware = getSaveTaskIncompleteMiddleware(IncompleteTeamMemberStreakTaskModel as any);

            await middleware(request, response, next);

            expect(response.locals.incompleteTeamMemberStreakTask).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws SaveTaskIncompleteMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const streakId = '1234';
            const taskIncompleteTime = new Date();
            const taskIncompleteDay = '09/05/2019';
            const incompleteTeamMemberStreakTaskDefinition = {
                userId,
                streakId,
                taskIncompleteTime,
                taskIncompleteDay,
            };
            const request: any = {};
            const response: any = { locals: { incompleteTeamMemberStreakTaskDefinition } };
            const next = jest.fn();
            const middleware = getSaveTaskIncompleteMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SaveTaskIncompleteMiddleware, expect.any(Error)));
        });
    });

    describe('incompleteTeamMemberStreakMiddleware', () => {
        test('if number of days in a row of current streak is equal to 0 it sets completedToday to false, set currentStreak to the default value, and calls next', async () => {
            expect.assertions(2);
            const teamMemberStreakId = '123abc';
            const teamMemberStreak = {
                _id: teamMemberStreakId,
                currentStreak: {
                    numberOfDaysInARow: 0,
                },
            };
            const updateOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                updateOne,
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();
            const middleware = getIncompleteTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: teamMemberStreakId },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    'currentStreak.startDate': null,
                    active: false,
                },
            );
            expect(next).toBeCalledWith();
        });

        test('if number of days in a row of current streak is not equal to 0 it updates streak completedToday, descrements number of days by one, sets active to false and calls next', async () => {
            expect.assertions(2);
            const teamMemberStreakId = '123abc';
            const teamMemberStreak = {
                _id: teamMemberStreakId,
                currentStreak: {
                    numberOfDaysInARow: 1,
                },
            };
            const updateOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                updateOne,
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();
            const middleware = getIncompleteTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: teamMemberStreakId },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                },
            );
            expect(next).toBeCalledWith();
        });

        test('throws IncompleteTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const teamMemberStreakModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncompleteTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IncompleteTeamMemberStreakMiddleware, expect.any(Error)),
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

        test('throws IncompleteTeamMemberStreakTaskDecreaseTotalStreakCompletesForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDecreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.IncompleteTeamMemberStreakTaskDecreaseTotalStreakCompletesForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('decreaseTotalTimesTrackedForTeamMemberStreakMiddleware', () => {
        test('decreases totalTimesTracked for teamMember streak by one and calls next', async () => {
            expect.assertions(3);
            const teamMemberStreakId = '123abc';
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { teamMemberStreakId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDecreaseTotalTimesTrackedForTeamMemberStreakMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamMemberStreakId,
                {
                    $inc: { totalTimesTracked: -1 },
                },
                { new: true },
            );
            expect(response.locals.teamMemberStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws DecreaseTotalTimesTrackedForTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDecreaseTotalTimesTrackedForTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DecreaseTotalTimesTrackedForTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('decreaseTotalTimesTrackedForTeamStreakMiddleware', () => {
        test('decreases totalTimesTracked for team streak by one and calls next', async () => {
            expect.assertions(3);
            const user = getMockUser({ _id: 'userId' });
            const teamStreak = getMockTeamStreak({ creatorId: user._id });
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getDecreaseTotalTimesTrackedForTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamStreak._id,
                {
                    $inc: { totalTimesTracked: -1 },
                },
                { new: true },
            );
            expect(response.locals.teamStreak).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws DecreaseTotalTimesTrackedForTeamStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDecreaseTotalTimesTrackedForTeamStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.DecreaseTotalTimesTrackedForTeamStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('chargeCoinsToUserForCompletingTeamMemberStreakMiddleware', () => {
        test('charges user account with coins for completing teamMember streaks', async () => {
            expect.assertions(3);
            const teamMemberStreakId = '123abc';
            const userId = 'userId';
            const teamStreak = getMockTeamStreak({ creatorId: userId });
            const createCoinTransaction = jest.fn(() => Promise.resolve(true));
            const request: any = { body: { teamMemberStreakId, userId } };
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware(
                createCoinTransaction as any,
            );

            await middleware(request, response, next);

            expect(createCoinTransaction).toBeCalledWith({
                userId,
                source: {
                    coinSourceType: CoinSourcesTypes.teamMemberStreakComplete,
                    teamMemberStreakId,
                    teamStreakId: teamStreak._id,
                    teamStreakName: teamStreak.streakName,
                },
                coins: coinValues[CoinSourcesTypes.teamMemberStreakComplete],
            });
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws ChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.ChargeCoinsToUserForIncompletingTeamMemberStreakMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('chargeOidXpToUserForCompletingTeamMemberStreakMiddleware', () => {
        test('charges user account with xp for completing teamMember streaks', async () => {
            expect.assertions(3);
            const teamMemberStreakId = '123abc';
            const userId = 'userId';
            const teamStreak = getMockTeamStreak({ creatorId: userId });
            const createOidXpTransaction = jest.fn(() => Promise.resolve(true));
            const request: any = { body: { teamMemberStreakId, userId } };
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware(
                createOidXpTransaction as any,
            );

            await middleware(request, response, next);

            expect(createOidXpTransaction).toBeCalledWith({
                userId,
                source: {
                    oidXpSourceType: OidXpSourcesTypes.teamMemberStreakComplete,
                    teamMemberStreakId,
                    teamStreakId: teamStreak._id,
                    teamStreakName: teamStreak.streakName,
                },
                oidXp: oidXpValues[OidXpSourcesTypes.teamMemberStreakComplete],
            });
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws ChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.ChargeOidXpToUserForIncompletingTeamMemberStreakMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('resetTeamStreakStartDateMiddleware', () => {
        test('if currentStreak number of days is 1 and this is the first streak it resets the current streak', async () => {
            expect.assertions(3);
            const lean = jest.fn(() => true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const teamStreakModel: any = {
                findByIdAndUpdate,
            };
            const teamStreakId = 1;
            const teamStreak = {
                _id: teamStreakId,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 1,
                },
                pastStreaks: [],
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next: any = jest.fn();
            const middleware = await getResetTeamStreakStartDateMiddleware(teamStreakModel);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamStreakId,
                {
                    currentStreak: { startDate: null, numberOfDaysInARow: 0 },
                },
                { new: true },
            );
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test("doesn't update teamStreak in number of days in a row > 1", async () => {
            expect.assertions(2);
            const findByIdAndUpdate = jest.fn();
            const teamStreakModel: any = {
                findByIdAndUpdate,
            };
            const teamStreakId = 2;
            const teamStreak = {
                currentStreak: {
                    startDate: new Date(),
                    numberOfDaysInARow: 2,
                },
            };
            const request: any = { params: { teamStreakId } };
            const response: any = { locals: { teamStreak } };
            const next: any = jest.fn();
            const middleware = await getResetTeamStreakStartDateMiddleware(teamStreakModel);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws ResetTeamStreakStartDateMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getResetTeamStreakStartDateMiddleware(undefined as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.ResetTeamStreakStartDateMiddleware, expect.any(Error)),
            );
        });
    });

    describe('incompleteTeamStreakMiddleware', () => {
        test('if number of days in a row of current streak is equal to 0 sand completedToday is true it sets completedToday to false, set currentStreak.numberOfDays in a row to 0 calls next', async () => {
            expect.assertions(3);
            const teamStreakId = '123abc';
            const teamStreak = {
                _id: teamStreakId,
                completedToday: true,
                currentStreak: {
                    numberOfDaysInARow: 0,
                },
            };
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const teamStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getIncompleteTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamStreakId,
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                },
                { new: true },
            );
            expect(lean).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('if number of days in a row of current streak is not equal to 0 and completedToday is true it sets completedToday to false, decrements number of days by one, and calls next', async () => {
            expect.assertions(3);
            const teamStreakId = '123abc';
            const teamStreak = {
                _id: teamStreakId,
                completedToday: true,
                currentStreak: {
                    numberOfDaysInARow: 1,
                },
            };
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const teamStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getIncompleteTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamStreakId,
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                },
                { new: true },
            );
            expect(lean).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('if completedToday is false it calls next', async () => {
            expect.assertions(3);
            const teamStreakId = '123abc';
            const teamStreak = {
                _id: teamStreakId,
                completedToday: false,
                currentStreak: {
                    numberOfDaysInARow: 1,
                },
            };
            const lean = jest.fn().mockResolvedValue(true);
            const updateOne = jest.fn(() => ({ lean }));
            const teamStreakModel = {
                updateOne,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getIncompleteTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).not.toBeCalled();
            expect(lean).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws IncompleteTeamMemberStreakMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const teamStreakModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncompleteTeamStreakMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IncompleteTeamMemberStreakMiddleware, expect.any(Error)),
            );
        });
    });

    describe('createTeamStreakIncompleteMiddleware', () => {
        test('saves an incomplete team streak model to the database', async () => {
            expect.assertions(2);

            const userId = 'userId';
            const teamStreakId = 'teamStreakId';
            const taskIncompleteDay = new Date().toString();
            const taskIncompleteTime = new Date().toString();
            const save = jest.fn().mockResolvedValue(true);
            const incompleteTeamStreakModel = jest.fn(() => ({ save }));

            const request: any = { body: { userId, teamStreakId } };
            const response: any = { locals: { taskIncompleteDay, taskIncompleteTime } };
            const next = jest.fn();

            const middleware = getCreateTeamStreakIncompleteMiddleware(incompleteTeamStreakModel as any);
            await middleware(request, response, next);

            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateTeamStreakIncomplete error on middleware failure', async () => {
            expect.assertions(1);
            const teamStreakModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getCreateTeamStreakIncompleteMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamStreakIncomplete, expect.any(Error)));
        });
    });

    describe('retrieveTeamMembersMiddleware', () => {
        test('retrieves team members without current user and calls next.', async () => {
            expect.assertions(3);
            const user = {
                _id: '_id',
            };
            const memberId = 'memberId';
            const member = { memberId };
            const teamStreak = {
                members: [member],
            };
            const lean = jest.fn().mockResolvedValue([{ _id: 'userId' }]);
            const find = jest.fn(() => ({ lean }));
            const userModel = {
                find,
            };
            const request: any = {};
            const response: any = { locals: { user, teamStreak } };
            const next = jest.fn();
            const middleware = getRetrieveTeamMembersMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(find).toBeCalledWith({ _id: [memberId] });
            expect(response.locals.teamMembers).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RetrieveTeamMembers error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveTeamMembersMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateIncompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`notifyTeamMembersThatUserHasIncompletedTaskMiddleware`, () => {
        test('sends user has incompleted task push notification to team members if they have teamStreakUpdates notifications on, a deviceType and an endpointArn', async () => {
            expect.assertions(2);
            const user = {
                _id: 'userId',
                username: 'username',
            };
            const teamStreak = {
                streakName: 'Daily Spanish',
            };
            const teamMember = getMockUser({ _id: 'abc' });
            const teamMembers = [teamMember];

            const sendPushNotification = jest.fn().mockResolvedValue(true);
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    teamStreak,
                    teamMembers,
                },
            };
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware(sendPushNotification as any);
            await middleware(request, response, next);

            expect(sendPushNotification).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('does not send notification if team member does not have push notifications on', async () => {
            expect.assertions(2);

            const user = {
                _id: '_id',
                username: 'username',
            };
            const teamStreak = {
                streakName: 'Daily Spanish',
            };
            const mockUser = getMockUser({ _id: 'abc' });
            const teamMember: User = {
                ...mockUser,
                pushNotifications: { ...mockUser.pushNotifications, teamStreakUpdates: { enabled: false } },
            };
            const teamMembers = [teamMember];

            const sendPushNotification = jest.fn().mockResolvedValue(true);
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    teamStreak,
                    teamMembers,
                },
            };
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware(sendPushNotification);
            await middleware(request, response, next);

            expect(sendPushNotification).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('does not send notification to user who incompleted the task', async () => {
            expect.assertions(2);

            const user = getMockUser({ _id: '_id' });
            const teamStreak = {
                streakName: 'Daily Spanish',
            };
            const teamMembers = [user];
            const sendPushNotification = jest.fn().mockResolvedValue(true);
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    teamStreak,
                    teamMembers,
                },
            };
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware(sendPushNotification as any);
            await middleware(request, response, next);

            expect(sendPushNotification).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('calls next with NotifyTeamMembersThatUserHasIncompletedTaskMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.NotifyTeamMembersThatUserHasIncompletedTaskMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendTaskIncompleteResponseMiddleware', () => {
        test('sends incompleteTeamMemberStreakTask response', () => {
            expect.assertions(3);
            const send = jest.fn(() => true);
            const status = jest.fn(() => ({ send }));
            const incompleteTeamMemberStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskIncompleteTime: new Date(),
                taskIncompleteDay: '10/05/2019',
            };
            const successResponseCode = 200;
            const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
            const request: any = {};
            const response: any = { locals: { incompleteTeamMemberStreakTask }, status };
            const next = jest.fn();

            middleware(request, response, next);

            expect(status).toBeCalledWith(successResponseCode);
            expect(send).toBeCalledWith(incompleteTeamMemberStreakTask);
            expect(next).toBeCalled();
        });

        test('throws SendTaskIncompleteResponseMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const incompleteTeamMemberStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskIncompleteTime: new Date(),
                taskIncompleteDay: '10/05/2019',
            };
            const successResponseCode = 200;
            const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
            const request: any = {};
            const response: any = { locals: { incompleteTeamMemberStreakTask } };
            const next = jest.fn();

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createIncompleteTeamMemberStreakActivityFeedItemMiddleware`, () => {
        test('creates a new incompletedTeamMemberStreakActivity', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const teamStreak = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateIncompleteTeamMemberStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateIncompleteTeamMemberStreakActivityMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateIncompleteTeamMemberStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CreateIncompleteTeamMemberStreakActivityFeedItemMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    test('are defined in the correct order', async () => {
        expect.assertions(24);

        expect(createIncompleteTeamMemberStreakTaskMiddlewares.length).toEqual(23);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[0]).toBe(
            incompleteTeamMemberStreakTaskBodyValidationMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[1]).toBe(teamMemberStreakExistsMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[2]).toBe(teamStreakExistsMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[3]).toBe(
            ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[4]).toBe(resetStreakStartDateMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[5]).toBe(retrieveUserMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[6]).toBe(setTaskIncompleteTimeMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[7]).toBe(setDayTaskWasIncompletedMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[8]).toBe(
            createIncompleteTeamMemberStreakTaskDefinitionMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[9]).toBe(saveTaskIncompleteMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[10]).toBe(incompleteTeamMemberStreakMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[11]).toBe(decreaseTotalStreakCompletesForUserMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[12]).toBe(
            decreaseTotalTimesTrackedForTeamMemberStreakMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[13]).toBe(
            decreaseTotalTimesTrackedForTeamStreakMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[14]).toBe(
            chargeCoinsToUserForIncompletingTeamMemberStreakMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[15]).toBe(
            chargeOidXpToUserForIncompletingTeamMemberStreakMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[16]).toBe(resetTeamStreakStartDateMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[17]).toBe(incompleteTeamStreakMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[18]).toBe(createTeamStreakIncompleteMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[19]).toBe(retrieveTeamMembersMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[20]).toBe(
            notifiyTeamMembersThatUserHasIncompletedTaskMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[21]).toBe(sendTaskIncompleteResponseMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[22]).toBe(
            createIncompleteTeamMemberStreakActivityFeedItemMiddleware,
        );
    });
});
