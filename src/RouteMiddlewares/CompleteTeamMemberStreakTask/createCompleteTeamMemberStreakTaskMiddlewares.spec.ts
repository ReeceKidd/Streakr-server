/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCompleteTeamMemberStreakTaskMiddlewares,
    retreiveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    sendCompleteTeamMemberStreakTaskResponseMiddleware,
    teamMemberStreakExistsMiddleware,
    streakMaintainedMiddleware,
    getTeamMemberStreakExistsMiddleware,
    getRetreiveUserMiddleware,
    getSetDayTaskWasCompletedMiddleware,
    getSetTaskCompleteTimeMiddleware,
    getStreakMaintainedMiddleware,
    setStreakStartDateMiddleware,
    getSetStreakStartDateMiddleware,
    completeTeamMemberStreakTaskBodyValidationMiddleware,
    createCompleteTeamMemberStreakTaskMiddleware,
    getCreateCompleteTeamMemberStreakTaskMiddleware,
    getTeamStreakExistsMiddleware,
    teamStreakExistsMiddleware,
    ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
    makeTeamStreakActiveMiddleware,
    getMakeTeamStreakActiveMiddleware,
} from './createCompleteTeamMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTypes } from '@streakoid/streakoid-sdk/lib';

describe(`completeTeamMemberStreakTaskBodyValidationMiddleware`, () => {
    const userId = 'abcdefgh';
    const teamStreakId = 'a1b2c3d4';
    const teamMemberStreakId = '123456';
    const streakType = StreakTypes.teamMember;

    const body = {
        userId,
        teamStreakId,
        teamMemberStreakId,
        streakType,
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

    test('sends correct error response when streakType is solo streak', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakType: StreakTypes.solo },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakType" fails because ["streakType" must be one of [teamMember]]',
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
        const middleware = getRetreiveUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware, expect.any(Error)),
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
            streakType: string;

            constructor(
                userId: string,
                teamStreakId: string,
                teamMemberStreakId: string,
                taskCompleteTime: Date,
                taskCompleteDay: string,
                streakType: string,
            ) {
                this.userId = userId;
                this.teamStreakId = teamStreakId;
                this.teamMemberStreakId = teamMemberStreakId;
                this.taskCompleteTime = taskCompleteTime;
                this.taskCompleteDay = taskCompleteDay;
                this.streakType = streakType;
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
        const middleware = getCreateCompleteTeamMemberStreakTaskMiddleware(CompleteTeamMemberStreakTaskModel as any);

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
        const updateOne = jest.fn(() => Promise.resolve(true));
        const teamMemberStreakModel = {
            updateOne,
        };
        const request: any = { body: { teamMemberStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getStreakMaintainedMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: teamMemberStreakId },
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
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
        const middleware = getStreakMaintainedMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.StreakMaintainedMiddleware, expect.any(Error)));
    });
});

describe('makeTeamStreakActiveMiddleware', () => {
    test('updates team streak active property to be true', async () => {
        expect.assertions(2);
        const teamStreakId = '123abc';
        const updateOne = jest.fn(() => Promise.resolve(true));
        const teamStreakModel = {
            updateOne,
        };
        const request: any = { body: { teamStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getMakeTeamStreakActiveMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: teamStreakId },
            {
                active: true,
            },
        );
        expect(next).toBeCalledWith();
    });

    test('throws MakeTeamStreakActive error on middleware failure', async () => {
        expect.assertions(1);
        const teamStreakId = '123abc';
        const teamStreakModel = {};
        const request: any = { params: { teamStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getMakeTeamStreakActiveMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.StreakMaintainedMiddleware, expect.any(Error)));
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
            streakType: 'teamMember-streak',
        };

        const request: any = {};
        const response: any = { locals: { completeTeamMemberStreakTask }, status };
        const next = jest.fn();

        sendCompleteTeamMemberStreakTaskResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(201);
        expect(send).toBeCalledWith(completeTeamMemberStreakTask);
        expect(next).not.toBeCalled();
    });

    test('throws SendTaskCompleteResponseMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const completeTeamMemberStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskCompleteTime: new Date(),
            taskCompleteDay: '10/05/2019',
            streakType: 'teamMember-streak',
        };

        const request: any = {};
        const response: any = { locals: { completeTeamMemberStreakTask } };
        const next = jest.fn();

        sendCompleteTeamMemberStreakTaskResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTaskCompleteResponseMiddleware, expect.any(Error)));
    });
});

describe(`createCompleteTeamMemberStreakTaskMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(13);

        expect(createCompleteTeamMemberStreakTaskMiddlewares.length).toEqual(12);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[0]).toBe(
            completeTeamMemberStreakTaskBodyValidationMiddleware,
        );
        expect(createCompleteTeamMemberStreakTaskMiddlewares[1]).toBe(teamStreakExistsMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[2]).toBe(teamMemberStreakExistsMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[3]).toBe(
            ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
        );
        expect(createCompleteTeamMemberStreakTaskMiddlewares[4]).toBe(retreiveUserMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[5]).toBe(setTaskCompleteTimeMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[6]).toBe(setStreakStartDateMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[7]).toBe(setDayTaskWasCompletedMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[8]).toBe(createCompleteTeamMemberStreakTaskMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[9]).toBe(streakMaintainedMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[10]).toBe(makeTeamStreakActiveMiddleware);
        expect(createCompleteTeamMemberStreakTaskMiddlewares[11]).toBe(
            sendCompleteTeamMemberStreakTaskResponseMiddleware,
        );
    });
});
