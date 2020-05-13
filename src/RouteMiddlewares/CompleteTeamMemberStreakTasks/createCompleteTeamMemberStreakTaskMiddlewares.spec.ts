/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCompleteTeamMemberStreakTaskMiddlewares,
    retrieveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    sendCompleteTeamMemberStreakTaskResponseMiddleware,
    teamMemberStreakExistsMiddleware,
    teamMemberStreakMaintainedMiddleware,
    getTeamMemberStreakExistsMiddleware,
    getRetrieveUserMiddleware,
    getSetDayTaskWasCompletedMiddleware,
    getSetTaskCompleteTimeMiddleware,
    getTeamMemberStreakMaintainedMiddleware,
    setStreakStartDateMiddleware,
    getSetStreakStartDateMiddleware,
    completeTeamMemberStreakTaskBodyValidationMiddleware,
    createCompleteTeamMemberStreakTaskMiddleware,
    getCreateCompleteTeamMemberStreakTaskMiddleware,
    getTeamStreakExistsMiddleware,
    teamStreakExistsMiddleware,
    ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
    haveAllTeamMembersCompletedTasksMiddleware,
    getHaveAllTeamMembersCompletedTasksMiddleware,
    setTeamStreakStartDateMiddleware,
    setDayTeamStreakWasCompletedMiddleware,
    createCompleteTeamStreakDefinitionMiddleware,
    saveCompleteTeamStreakMiddleware,
    teamStreakMaintainedMiddleware,
    getSetTeamStreakStartDateMiddleware,
    getSetDayTeamStreakWasCompletedMiddleware,
    getSaveCompleteTeamStreakMiddleware,
    getTeamStreakMaintainedMiddleware,
    setTeamStreakToActiveMiddleware,
    getSetTeamStreakToActiveMiddleware,
    retrieveTeamMembersMiddleware,
    notifiyTeamMembersThatUserHasCompletedTaskMiddleware,
    getRetrieveTeamMembersMiddleware,
    getNotifyTeamMembersThatUserHasCompletedTaskMiddleware,
    getCreateCompleteTeamMemberStreakActivityFeedItemMiddleware,
    createCompleteTeamMemberStreakActivityFeedItemMiddleware,
    getIncreaseTotalStreakCompletesForUserMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
} from './createCompleteTeamMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

describe('completeTeamMemberStreakTaskMiddlewares', () => {
    describe(`completeTeamMemberStreakTaskBodyValidationMiddleware`, () => {
        const userId = 'abcdefgh';
        const teamStreakId = 'a1b2c3d4';
        const teamMemberStreakId = '123456';

        const body = {
            userId,
            teamStreakId,
            teamMemberStreakId,
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

            completeTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

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

            completeTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" is required]',
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

            completeTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
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

            completeTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" is required]',
            });
            expect(next).not.toBeCalled();
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

        test('throws teamStreakDoesNotExist error when teamMember streak does not exist', async () => {
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamStreakDoesNotExist));
        });

        test('throws teamStreakExistsMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getTeamStreakExistsMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamStreakExistsMiddleware, expect.any(Error)));
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

        test('throws TeamMemberStreakDoesNotExist error when teamMember streak does not exist', async () => {
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamMemberStreakDoesNotExist));
        });

        test('throws TeamMemberStreakExistsMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = { locals: {} };
            const next = jest.fn();
            const findOne = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = { findOne };
            const middleware = getTeamMemberStreakExistsMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamMemberStreakExistsMiddleware, expect.any(Error)));
        });
    });

    describe('ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware', () => {
        test('if teamMemerStreak.completedToday is false it calls the next middleware', () => {
            const teamMemberStreak = {
                completedToday: false,
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();

            ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('if teamMemberStreak.completedToday is true it throws TeamMemberStreakHasBeenCompletedToday error message', () => {
            const teamMemberStreak = {
                completedToday: true,
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak } };
            const next = jest.fn();

            ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.TeamMemberStreakTaskHasBeenCompletedToday));
        });

        test('throws EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetrieveUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
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

        test('throws UserDoesNotExistError when user does not exist', async () => {
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.UserDoesNotExist));
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveUserMiddleware, expect.any(Error)));
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

            expect(next).toBeCalledWith(new CustomError(ErrorType.SetTaskCompleteTimeMiddleware, expect.any(Error)));
        });
    });

    describe('setStreakStartDateMiddleware', () => {
        test("sets teamMemberStreak.startDate to taskCompleteTime if it's undefined and calls next()", async () => {
            expect.assertions(2);
            const updateOne = jest.fn().mockResolvedValue(true);
            const teamMemberStreakModel: any = {
                updateOne,
            };
            const taskCompleteTime = new Date();
            const teamMemberStreakId = 1;
            const teamMemberStreak = {
                _id: teamMemberStreakId,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0,
                },
            };
            const request: any = {};
            const response: any = { locals: { teamMemberStreak, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetStreakStartDateMiddleware(teamMemberStreakModel);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: teamMemberStreakId },
                {
                    currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 },
                },
            );
            expect(next).toBeCalledWith();
        });

        test("doesn't update teamMemberStreak currentStreak.startDate if it's already set", async () => {
            expect.assertions(2);
            const findByIdAndUpdate = jest.fn();
            const teamMemberStreakModel: any = {
                findByIdAndUpdate,
            };
            const taskCompleteTime = new Date();
            const teamMemberStreakId = 1;
            const teamMemberStreak = {
                currentStreak: {
                    startDate: new Date(),
                },
            };
            const request: any = { params: { teamMemberStreakId } };
            const response: any = { locals: { teamMemberStreak, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetStreakStartDateMiddleware(teamMemberStreakModel);

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

    describe(`createCompleteTeamMemberStreakTaskMiddleware`, () => {
        test('sets response.locals.completeTeamMemberStreakTask and calls next', async () => {
            expect.assertions(3);
            const userId = 'abcd';
            const teamStreakId = '1234';
            const teamMemberStreakId = '1a2b3c4d';
            const taskCompleteTime = new Date();
            const taskCompleteDay = '09/05/2019';

            const save = jest.fn(() => Promise.resolve(true));
            class CompleteTeamMemberStreakTaskModel {
                userId: string;
                teamStreakId: string;
                teamMemberStreakId: string;
                taskCompleteTime: Date;
                taskCompleteDay: string;

                constructor(
                    userId: string,
                    teamStreakId: string,
                    teamMemberStreakId: string,
                    taskCompleteTime: Date,
                    taskCompleteDay: string,
                ) {
                    this.userId = userId;
                    this.teamStreakId = teamStreakId;
                    this.teamMemberStreakId = teamMemberStreakId;
                    this.taskCompleteTime = taskCompleteTime;
                    this.taskCompleteDay = taskCompleteDay;
                }

                save = save;
            }
            const request: any = {
                body: { userId, teamStreakId, teamMemberStreakId },
            };
            const response: any = {
                locals: { taskCompleteTime, taskCompleteDay },
            };
            const next = jest.fn();
            const middleware = getCreateCompleteTeamMemberStreakTaskMiddleware(
                CompleteTeamMemberStreakTaskModel as any,
            );

            await middleware(request, response, next);

            expect(response.locals.completeTeamMemberStreakTask).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws SaveTaskCompleteMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {
                locals: {},
            };
            const next = jest.fn();
            const middleware = getCreateCompleteTeamMemberStreakTaskMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskMiddleware, expect.any(Error)),
            );
        });
    });

    describe('streakMaintainedMiddleware', () => {
        test('updates streak completedToday, increments number of days, sets active and calls next', async () => {
            expect.assertions(2);
            const teamMemberStreakId = '123abc';
            const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
            const teamMemberStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { teamMemberStreakId } };
            const response: any = {};
            const next = jest.fn();
            const middleware = getTeamMemberStreakMaintainedMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamMemberStreakId,
                {
                    completedToday: true,
                    $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                    active: true,
                },
                {
                    new: true,
                },
            );
            expect(next).toBeCalledWith();
        });

        test('throws StreakMaintainedMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const teamMemberStreakId = '123abc';
            const teamMemberStreakModel = {};
            const request: any = { params: { teamMemberStreakId } };
            const response: any = {};
            const next = jest.fn();
            const middleware = getTeamMemberStreakMaintainedMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.TeamMemberStreakMaintainedMiddleware, expect.any(Error)),
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

        test('throws CompleteTeamMemberStreakTaskIncreaseTotalStreakCompletesForUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getIncreaseTotalStreakCompletesForUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.CompleteTeamMemberStreakTaskIncreaseTotalStreakCompletesForUserMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('setTeamStreakToActiveMiddleware', () => {
        test('sets team streak active to true and calls next', async () => {
            expect.assertions(2);
            const teamStreakId = '123abc';
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const teamStreakModel = {
                findByIdAndUpdate,
            };
            const request: any = { body: { teamStreakId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getSetTeamStreakToActiveMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                teamStreakId,
                {
                    active: true,
                },
                {
                    new: true,
                },
            );
            expect(next).toBeCalledWith();
        });

        test('throws SetTeamStreakToActive error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getSetTeamStreakToActiveMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SetTeamStreakToActive, expect.any(Error)));
        });
    });

    describe('haveAllTeamMembersCompletedTasksMiddleware', () => {
        test('if one of the team members have not completed their streak today teamStreakCompletedToday should equal false', async () => {
            expect.assertions(3);
            const teamMemberStreakId = 'teamMemberStreakId';
            const members = [{ teamMemberStreakId }];
            const teamStreak = {
                members,
            };
            const findOne = jest.fn(() => Promise.resolve({ completedToday: false }));
            const teamMemberStreakModel = {
                findOne,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getHaveAllTeamMembersCompletedTasksMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: teamMemberStreakId });
            expect(response.locals.teamStreakCompletedToday).toEqual(false);
            expect(next).toBeCalledWith();
        });

        test('if all of the team members streaks have been completedToday set teamStreakCompletedToday to true as everyone has completed their tasks', async () => {
            expect.assertions(3);
            const teamMemberStreakId = 'teamMemberStreakId';
            const members = [{ teamMemberStreakId }];
            const teamStreakId = 'teamStreakId';
            const teamStreak = {
                _id: teamStreakId,
                members,
            };
            const findOne = jest.fn(() => Promise.resolve({ completedToday: true }));
            const teamMemberStreakModel = {
                findOne,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getHaveAllTeamMembersCompletedTasksMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ _id: teamMemberStreakId });
            expect(response.locals.teamStreakCompletedToday).toEqual(true);
            expect(next).toBeCalledWith();
        });

        test('if no team member streak exists middlewares throws CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist', async () => {
            expect.assertions(1);
            const memberId = 'memberId';
            const members = [{ memberId }];
            const teamStreakId = 'teamStreakId';
            const teamStreak = {
                _id: teamStreakId,
                members,
            };
            const findOne = jest.fn(() => Promise.resolve(false));
            const teamMemberStreakModel = {
                findOne,
            };
            const request: any = {};
            const response: any = { locals: { teamStreak } };
            const next = jest.fn();
            const middleware = getHaveAllTeamMembersCompletedTasksMiddleware(teamMemberStreakModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist),
            );
        });

        test('throws HaveAllTeamMembersCompletedTasksMiddlewares error on middleware failure', async () => {
            expect.assertions(1);
            const teamStreakId = '123abc';
            const request: any = { params: { teamStreakId } };
            const response: any = {};
            const next = jest.fn();
            const middleware = getHaveAllTeamMembersCompletedTasksMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.HaveAllTeamMembersCompletedTasksMiddlewares, expect.any(Error)),
            );
        });
    });

    describe('setTeamStreakStartDateMiddleware', () => {
        test("if the team streak was completed today it defines team streak current streak start date if it's undefined  and calls next()", async () => {
            expect.assertions(2);
            const updateOne = jest.fn().mockResolvedValue(true);
            const teamStreakModel: any = {
                updateOne,
            };
            const taskCompleteTime = new Date();
            const teamStreakId = 1;
            const teamStreak = {
                _id: teamStreakId,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0,
                },
            };
            const teamStreakCompletedToday = true;
            const request: any = {};
            const response: any = { locals: { teamStreak, teamStreakCompletedToday, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetTeamStreakStartDateMiddleware(teamStreakModel);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: teamStreakId },
                {
                    currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 },
                },
            );
            expect(next).toBeCalledWith();
        });

        test("if team streak was completed today it doesn't update teamStreak currentStreak.startDate if it's already defined", async () => {
            expect.assertions(2);
            const updateOne = jest.fn();
            const teamStreakModel: any = {
                updateOne,
            };
            const taskCompleteTime = new Date();
            const teamStreak = {
                currentStreak: {
                    startDate: new Date(),
                },
            };
            const teamStreakCompletedToday = true;
            const request: any = {};
            const response: any = { locals: { teamStreak, teamStreakCompletedToday, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetTeamStreakStartDateMiddleware(teamStreakModel);

            await middleware(request, response, next);

            expect(updateOne).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('if team streak was not completed today call next()', async () => {
            expect.assertions(2);
            const updateOne = jest.fn();
            const teamStreakModel: any = {
                updateOne,
            };
            const taskCompleteTime = new Date();
            const teamStreakCompletedToday = false;
            const teamStreak = {
                currentStreak: {
                    startDate: new Date(),
                },
            };
            const request: any = {};
            const response: any = { locals: { teamStreak, teamStreakCompletedToday, taskCompleteTime } };
            const next: any = jest.fn();
            const middleware = await getSetTeamStreakStartDateMiddleware(teamStreakModel);

            await middleware(request, response, next);

            expect(updateOne).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteTeamStreakSetStreakStartDateMiddleware on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getSetStreakStartDateMiddleware(undefined as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamStreakSetStreakStartDateMiddleware, expect.any(Error)),
            );
        });
    });

    describe('setDayTeamTaskWasCompletedMiddleware', () => {
        test('if teamStreak was completed today sets response.locals.taskCompleteTime and calls next()', () => {
            expect.assertions(3);
            const dayFormat = 'DD/MM/YYYY';
            const format = jest.fn(() => true);
            const taskCompleteTime = {
                format,
            };
            const teamStreakCompletedToday = true;
            const request: any = {};
            const response: any = { locals: { teamStreakCompletedToday, taskCompleteTime } };
            const next = jest.fn();
            const middleware = getSetDayTeamStreakWasCompletedMiddleware(dayFormat);

            middleware(request, response, next);

            expect(format).toBeCalledWith(dayFormat);
            expect(response.locals.taskCompleteDay).toBeDefined();
            expect(next).toBeCalled();
        });

        test('if teamStreak was not completed today it calls next()', () => {
            expect.assertions(3);
            const dayFormat = 'DD/MM/YYYY';
            const format = jest.fn(() => true);
            const taskCompleteTime = {
                format,
            };
            const teamStreakCompletedToday = false;
            const request: any = {};
            const response: any = { locals: { teamStreakCompletedToday, taskCompleteTime } };
            const next = jest.fn();
            const middleware = getSetDayTeamStreakWasCompletedMiddleware(dayFormat);

            middleware(request, response, next);

            expect(format).not.toBeCalled();
            expect(response.locals.taskCompleteDay).not.toBeDefined();
            expect(next).toBeCalled();
        });

        test('throws CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const dayFormat = 'DD/MM/YYYY';
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getSetDayTeamStreakWasCompletedMiddleware(dayFormat);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware, expect.any(Error)),
            );
        });
    });

    describe('createCompleteTeamStreakDefinitionMiddleware', () => {
        test('if teamStreakCompletedToday sets completeTeamStreakDefinition and calls next()', () => {
            expect.assertions(3);
            const teamStreakId = 'abcd123';
            const toDate = jest.fn(() => '27/03/2019');
            const taskCompleteTime = {
                toDate,
            };
            const taskCompleteDay = '09/05/2019';
            const teamStreakCompletedToday = true;
            const request: any = {
                body: { teamStreakId },
            };
            const response: any = {
                locals: {
                    teamStreakCompletedToday,
                    taskCompleteTime,
                    taskCompleteDay,
                },
            };
            const next = jest.fn();

            createCompleteTeamStreakDefinitionMiddleware(request, response, next);

            expect(response.locals.completeTeamStreakDefinition).toEqual({
                teamStreakId,
                taskCompleteTime: taskCompleteTime.toDate(),
                taskCompleteDay,
            });
            expect(toDate).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('if teamStreakCompletedToday was not completed today call next()', () => {
            expect.assertions(3);
            const teamStreakId = 'abcd123';
            const toDate = jest.fn(() => '27/03/2019');
            const taskCompleteTime = {
                toDate,
            };
            const taskCompleteDay = '09/05/2019';
            const teamStreakCompletedToday = false;
            const request: any = {
                body: { teamStreakId },
            };
            const response: any = {
                locals: {
                    teamStreakCompletedToday,
                    taskCompleteTime,
                    taskCompleteDay,
                },
            };
            const next = jest.fn();

            createCompleteTeamStreakDefinitionMiddleware(request, response, next);

            expect(response.locals.completeTeamStreakDefinition).toBeUndefined();
            expect(toDate).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteTeamStreakDefinitionMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            createCompleteTeamStreakDefinitionMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamStreakDefinitionMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`saveCompleteTeamStreakMiddleware`, () => {
        test('if team streak was completed today sets response.locals.completeTeamStreak and calls next', async () => {
            expect.assertions(3);
            const streakId = '1234';
            const taskCompleteTime = new Date();
            const taskCompleteDay = '09/05/2019';
            const teamStreakCompletedToday = true;
            const completeTeamStreakDefinition = {
                streakId,
                taskCompleteTime,
                taskCompleteDay,
            };
            const save = jest.fn(() => Promise.resolve(true));
            class CompleteTeamStreakModel {
                streakId: string;
                taskCompleteTime: Date;
                taskCompleteDay: string;

                constructor(streakId: string, taskCompleteTime: Date, taskCompleteDay: string) {
                    (this.streakId = streakId), (this.taskCompleteTime = taskCompleteTime);
                    this.taskCompleteDay = taskCompleteDay;
                }

                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                save() {
                    return save();
                }
            }
            const request: any = {};
            const response: any = { locals: { completeTeamStreakDefinition, teamStreakCompletedToday } };
            const next = jest.fn();
            const middleware = getSaveCompleteTeamStreakMiddleware(CompleteTeamStreakModel as any);

            await middleware(request, response, next);

            expect(response.locals.completeTeamStreak).toBeDefined();
            expect(save).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('if team streak was not completed today sets response.locals.completeTeamStreak and calls next', async () => {
            expect.assertions(3);
            const streakId = '1234';
            const taskCompleteTime = new Date();
            const taskCompleteDay = '09/05/2019';
            const completeTeamStreakDefinition = {
                streakId,
                taskCompleteTime,
                taskCompleteDay,
            };
            const save = jest.fn(() => Promise.resolve(true));
            const request: any = {};
            const response: any = { locals: { completeTeamStreakDefinition } };
            const next = jest.fn();
            const middleware = getSaveCompleteTeamStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(response.locals.completeTeamStreak).not.toBeDefined();
            expect(save).not.toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteTeamStreakSaveTaskCompleteMiddleware error on Middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getSaveCompleteTeamStreakMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamStreakSaveTaskCompleteMiddleware, expect.any(Error)),
            );
        });
    });

    describe('teamStreakMaintainedMiddleware', () => {
        test('if team streak was completed today updates team streak completedToday, increments number of days, sets active and calls next', async () => {
            expect.assertions(2);
            const teamStreakId = '123abc';
            const updateOne = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = {
                updateOne,
            };
            const teamStreakCompletedToday = true;
            const request: any = { body: { teamStreakId } };
            const response: any = { locals: { teamStreakCompletedToday } };
            const next = jest.fn();
            const middleware = getTeamStreakMaintainedMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).toBeCalledWith(
                { _id: teamStreakId },
                {
                    completedToday: true,
                    $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                    active: true,
                },
            );
            expect(next).toBeCalledWith();
        });

        test('if team streak was not completed today call next', async () => {
            expect.assertions(2);
            const teamStreakId = '123abc';
            const updateOne = jest.fn(() => Promise.resolve(true));
            const teamStreakModel = {
                updateOne,
            };
            const teamStreakCompletedToday = false;
            const request: any = { body: { teamStreakId } };
            const response: any = { locals: { teamStreakCompletedToday } };
            const next = jest.fn();
            const middleware = getTeamStreakMaintainedMiddleware(teamStreakModel as any);

            await middleware(request, response, next);

            expect(updateOne).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('throws CreateCompleteTeamStreakStreakMaintainedMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getTeamStreakMaintainedMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamStreakStreakMaintainedMiddleware, expect.any(Error)),
            );
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
                    ErrorType.CreateCompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe(`notifyTeamMembersThatUserHasCompletedTaskMiddleware`, () => {
        test('sends push notification to team members if they have teamStreakUpdates notifications on', async () => {
            expect.assertions(3);
            const user = {
                _id: '_id',
                username: 'username',
            };
            const teamStreak = {
                streakName: 'Daily Spanish',
            };
            const teamMember: User = {
                _id: '_id',
                username: 'username',
                membershipInformation: {
                    isPayingMember: true,
                    currentMembershipStartDate: new Date(),
                    pastMemberships: [],
                },
                email: 'test@test.com',
                createdAt: 'Jan 1st',
                updatedAt: 'Jan 1st',
                timezone: 'Europe/London',
                userType: UserTypes.basic,
                totalStreakCompletes: 10,
                totalLiveStreaks: 0,
                followers: [],
                following: [],
                profileImages: {
                    originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
                },
                pushNotification: {
                    token: 'token',
                    endpointArn: 'endpointArn',
                    deviceType: PushNotificationSupportedDeviceTypes.android,
                },
                pushNotifications: {
                    completeAllStreaksReminder: {
                        enabled: true,
                        expoId: 'expoId',
                        reminderHour: 10,
                        reminderMinute: 15,
                        streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                    },
                    teamStreakUpdates: {
                        enabled: true,
                    },
                    newFollowerUpdates: {
                        enabled: true,
                    },
                    achievementUpdates: {
                        enabled: true,
                    },
                    customStreakReminders: [],
                },
                hasCompletedIntroduction: false,
                stripe: {
                    customer: 'abc',
                    subscription: 'sub_1',
                },
                achievements: [],
            };
            const teamMembers = [teamMember];
            const sendPushNotificationsAsync = jest.fn().mockResolvedValue(['message']);
            const chunkPushNotifications = jest.fn().mockResolvedValue(['message']);
            const expo: any = { chunkPushNotifications, sendPushNotificationsAsync };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    teamStreak,
                    teamMembers,
                },
            };
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasCompletedTaskMiddleware(expo);
            await middleware(request, response, next);
            expect(sendPushNotificationsAsync).toBeCalled();
            expect(chunkPushNotifications).toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('does not send notification if team member does not have teamStreakUpdates push notifications enabled', async () => {
            expect.assertions(3);

            const user = {
                _id: '_id',
                username: 'username',
            };
            const teamStreak = {
                streakName: 'Daily Spanish',
            };
            const teamMember: User = {
                _id: '_id',
                username: 'username',
                membershipInformation: {
                    isPayingMember: true,
                    currentMembershipStartDate: new Date(),
                    pastMemberships: [],
                },
                email: 'test@test.com',
                createdAt: 'Jan 1st',
                updatedAt: 'Jan 1st',
                timezone: 'Europe/London',
                userType: UserTypes.basic,
                totalStreakCompletes: 10,
                totalLiveStreaks: 0,
                followers: [],
                following: [],
                profileImages: {
                    originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
                },
                pushNotification: {
                    token: 'token',
                    endpointArn: 'endpointArn',
                    deviceType: PushNotificationSupportedDeviceTypes.android,
                },
                pushNotifications: {
                    completeAllStreaksReminder: {
                        enabled: true,
                        expoId: 'expoId',
                        reminderHour: 10,
                        reminderMinute: 15,
                        streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                    },
                    teamStreakUpdates: {
                        enabled: true,
                    },
                    newFollowerUpdates: {
                        enabled: true,
                    },
                    achievementUpdates: {
                        enabled: true,
                    },
                    customStreakReminders: [],
                },
                hasCompletedIntroduction: false,
                stripe: {
                    customer: 'abc',
                    subscription: 'sub_1',
                },
                achievements: [],
            };
            const teamMembers = [teamMember];
            const sendPushNotificationsAsync = jest.fn().mockResolvedValue([]);
            const chunkPushNotifications = jest.fn().mockResolvedValue([]);
            const expo: any = { chunkPushNotifications, sendPushNotificationsAsync };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    teamStreak,
                    teamMembers,
                },
            };
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasCompletedTaskMiddleware(expo);
            await middleware(request, response, next);

            expect(chunkPushNotifications).toBeCalled();
            expect(sendPushNotificationsAsync).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('does not send notification to user that completed the task', async () => {
            expect.assertions(3);

            const user = {
                _id: '_id',
                username: 'username',
            };
            const teamStreak = {
                streakName: 'Daily Spanish',
            };
            const teamMember: User = {
                _id: '_id',
                username: 'username',
                membershipInformation: {
                    isPayingMember: true,
                    currentMembershipStartDate: new Date(),
                    pastMemberships: [],
                },
                email: 'test@test.com',
                createdAt: 'Jan 1st',
                updatedAt: 'Jan 1st',
                timezone: 'Europe/London',
                userType: UserTypes.basic,
                totalStreakCompletes: 10,
                totalLiveStreaks: 0,
                followers: [],
                following: [],
                profileImages: {
                    originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
                },
                pushNotification: {
                    token: 'token',
                    endpointArn: 'endpointArn',
                    deviceType: PushNotificationSupportedDeviceTypes.android,
                },
                pushNotifications: {
                    completeAllStreaksReminder: {
                        enabled: true,
                        expoId: 'expoId',
                        reminderHour: 10,
                        reminderMinute: 15,
                        streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                    },
                    teamStreakUpdates: {
                        enabled: true,
                    },
                    newFollowerUpdates: {
                        enabled: true,
                    },
                    achievementUpdates: {
                        enabled: true,
                    },
                    customStreakReminders: [],
                },
                hasCompletedIntroduction: false,
                stripe: {
                    customer: 'abc',
                    subscription: 'sub_1',
                },
                achievements: [],
            };
            const teamMembers = [teamMember];
            const sendPushNotificationsAsync = jest.fn().mockResolvedValue([]);
            const chunkPushNotifications = jest.fn().mockResolvedValue([]);
            const expo: any = { chunkPushNotifications, sendPushNotificationsAsync };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    teamStreak,
                    teamMembers,
                },
            };
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasCompletedTaskMiddleware(expo);
            await middleware(request, response, next);

            expect(chunkPushNotifications).toBeCalled();
            expect(sendPushNotificationsAsync).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('calls next with NotifyTeamMembersThatUserHasCompletedTaskMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getNotifyTeamMembersThatUserHasCompletedTaskMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.NotifyTeamMembersThatUserHasCompletedTaskMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendCompleteTeamMemberStreakTaskResponseMiddleware', () => {
        test('sends completeTeamMemberStreakTask response', () => {
            expect.assertions(3);
            const send = jest.fn(() => true);
            const status = jest.fn(() => ({ send }));
            const completeTeamMemberStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskCompleteTime: new Date(),
                taskCompleteDay: '10/05/2019',
            };

            const request: any = {};
            const response: any = { locals: { completeTeamMemberStreakTask }, status };
            const next = jest.fn();

            sendCompleteTeamMemberStreakTaskResponseMiddleware(request, response, next);

            expect(status).toBeCalledWith(201);
            expect(send).toBeCalledWith(completeTeamMemberStreakTask);
            expect(next).toBeCalled();
        });

        test('throws SendTaskCompleteResponseMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const completeTeamMemberStreakTask = {
                userId: 'abcd',
                streakId: '1234',
                taskCompleteTime: new Date(),
                taskCompleteDay: '10/05/2019',
            };

            const request: any = {};
            const response: any = { locals: { completeTeamMemberStreakTask } };
            const next = jest.fn();

            sendCompleteTeamMemberStreakTaskResponseMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendTaskCompleteResponseMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createCompleteTeamMemberStreakActivityFeedItemMiddleware`, () => {
        test('creates a new completedTeamMemberStreakActivity', async () => {
            expect.assertions(2);
            const user = { _id: '_id' };
            const teamStreak = { _id: '_id' };
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const response: any = { locals: { user, teamStreak } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateCompleteTeamMemberStreakActivityFeedItemMiddleware(
                createActivityFeedItem as any,
            );

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateCompleteTeamMemberStreakActivityMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateCompleteTeamMemberStreakActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateCompleteTeamMemberStreakActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    test('are defined in the correct order', async () => {
        expect.assertions(23);

        expect(createCompleteTeamMemberStreakTaskMiddlewares.length).toEqual(22);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[0]).toBe(
            completeTeamMemberStreakTaskBodyValidationMiddleware,
        );
        expect(createCompleteTeamMemberStreakTaskMiddlewares[1]).toBe(teamStreakExistsMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[2]).toBe(teamMemberStreakExistsMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[3]).toBe(
            ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
        );
        expect(createCompleteTeamMemberStreakTaskMiddlewares[4]).toBe(retrieveUserMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[5]).toBe(setTaskCompleteTimeMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[6]).toBe(setStreakStartDateMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[7]).toBe(setDayTaskWasCompletedMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[8]).toBe(createCompleteTeamMemberStreakTaskMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[9]).toBe(teamMemberStreakMaintainedMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[10]).toBe(increaseTotalStreakCompletesForUserMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[11]).toBe(setTeamStreakToActiveMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[12]).toBe(haveAllTeamMembersCompletedTasksMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[13]).toBe(setTeamStreakStartDateMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[14]).toBe(setDayTeamStreakWasCompletedMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[15]).toBe(createCompleteTeamStreakDefinitionMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[16]).toBe(saveCompleteTeamStreakMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[17]).toBe(teamStreakMaintainedMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[18]).toBe(retrieveTeamMembersMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[19]).toBe(
            notifiyTeamMembersThatUserHasCompletedTaskMiddleware,
        );
        expect(createCompleteTeamMemberStreakTaskMiddlewares[20]).toBe(
            sendCompleteTeamMemberStreakTaskResponseMiddleware,
        );
        expect(createCompleteTeamMemberStreakTaskMiddlewares[21]).toBe(
            createCompleteTeamMemberStreakActivityFeedItemMiddleware,
        );
    });
});
