/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createIncompleteTeamMemberStreakTaskMiddlewares,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteTeamMemberStreakTaskDefinitionMiddleware,
    teamMemberStreakExistsMiddleware,
    saveTaskIncompleteMiddleware,
    getIncompleteTeamMemberStreakMiddleware,
    getTeamMemberStreakExistsMiddleware,
    getRetreiveUserMiddleware,
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
    hasAtLeastOneTeamMemberCompletedTheirTaskMiddleware,
    getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware,
    getMakeTeamStreakInactiveMiddleware,
    makeTeamStreakInactiveMiddleware,
} from './createIncompleteTeamMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`incompleteTeamMemberStreakTaskBodyValidationMiddleware`, () => {
    const userId = 'abcdefgh';
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

    test('throws CreateIncompleteTeamMemberStreakTaskUserDoesNotExist when user does not exist', async () => {
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskUserDoesNotExist));
    });

    test('throws CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware error on middleware failure', async () => {
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

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware, expect.any(Error)),
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

    test('throws SetTaskIncompleteTimeMiddlewre error on middleware failure', () => {
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.SetDayTaskWasIncompletedMiddleware, expect.any(Error)));
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

    test('throws CreateIncompleteTeamMemberStreakTaskDefinitionMiddlware error on middleware failure', () => {
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
    test('if number of days in a row of current streak is equal to 0 it sets completedToday to false, set currentStreak.numberOfDays in a row to 0, sets active to false and calls next', async () => {
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
                active: false,
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.IncompleteTeamMemberStreakMiddleware, expect.any(Error)));
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.ResetTeamStreakStartDateMiddleware, expect.any(Error)));
    });
});

describe('incompleteTeamStreakMiddleware', () => {
    test('if number of days in a row of current streak is equal to 0 it sets completedToday to false, set currentStreak.numberOfDays in a row to 0 calls next', async () => {
        expect.assertions(3);
        const teamStreakId = '123abc';
        const teamStreak = {
            _id: teamStreakId,
            currentStreak: {
                numberOfDaysInARow: 0,
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

        expect(updateOne).toBeCalledWith(
            { _id: teamStreakId },
            {
                completedToday: false,
                'currentStreak.numberOfDaysInARow': 0,
            },
            { new: true },
        );
        expect(lean).toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('if number of days in a row of current streak is not equal to 0 it sets completedToday to false, decrements number of days by one, and calls next', async () => {
        expect.assertions(3);
        const teamStreakId = '123abc';
        const teamStreak = {
            _id: teamStreakId,
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

        expect(updateOne).toBeCalledWith(
            { _id: teamStreakId },
            {
                completedToday: false,
                $inc: { 'currentStreak.numberOfDaysInARow': -1 },
            },
            { new: true },
        );
        expect(lean).toBeCalled();
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.IncompleteTeamMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('hasAtLeastOneTeamMemberCompletedTheirTaskMiddleware', () => {
    test('if one team member has completed their task set oneTeamMemberHasCompletedTheirTaskToday to true', async () => {
        expect.assertions(3);
        const teamMemberStreakId = 'teamMemberStreakId';
        const members = [{ teamMemberStreakId }];
        const teamStreak = {
            members,
        };
        const findOne = jest.fn(() => Promise.resolve({ completedToday: true }));
        const teamMemberStreakModel = {
            findOne,
        };
        const request: any = {};
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();
        const middleware = getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: teamMemberStreakId });
        expect(response.locals.atLeastOneTeamMemberHasCompletedTheirTaskToday).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if no team members have completed their tasks dont define atLeastOneTeamMemberHasCompletedTheirTaskToday', async () => {
        expect.assertions(3);
        const teamMemberStreakId = 'teamMemberStreakId';
        const members = [{ teamMemberStreakId }];
        const teamStreakId = 'teamStreakId';
        const teamStreak = {
            _id: teamStreakId,
            members,
        };
        const findOne = jest.fn(() => Promise.resolve({ completedToday: false }));
        const teamMemberStreakModel = {
            findOne,
        };
        const request: any = {};
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();
        const middleware = getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: teamMemberStreakId });
        expect(response.locals.atLeastOneTeamMemberHasCompletedTheirTaskToday).toBeUndefined();
        expect(next).toBeCalledWith();
    });

    test('if no team member streak exists middlewares throws IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist', async () => {
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
        const middleware = getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist),
        );
    });

    test('throws HaveAllTeamMembersCompletedTasksMiddlewares error on middleware failure', async () => {
        expect.assertions(1);
        const teamStreakId = '123abc';
        const request: any = { params: { teamStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.HasOneTeamMemberCompletedTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('makeTeamStreakInactiveMiddleware', () => {
    test('if no team members have completed their task today make team streak inactive', async () => {
        expect.assertions(2);
        const atLeastOneTeamMemberHasCompletedTheirTaskToday = false;
        const teamStreakId = '123abc';
        const teamStreak = {
            _id: teamStreakId,
            currentStreak: {
                numberOfDaysInARow: 1,
            },
        };
        const updateOne = jest.fn().mockResolvedValue(true);
        const teamStreakModel = {
            updateOne,
        };
        const request: any = {};
        const response: any = { locals: { atLeastOneTeamMemberHasCompletedTheirTaskToday, teamStreak } };
        const next = jest.fn();
        const middleware = getMakeTeamStreakInactiveMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: teamStreakId },
            {
                active: false,
            },
        );
        expect(next).toBeCalledWith();
    });

    test('if at least one team member has completed their task do nothing', async () => {
        expect.assertions(2);
        const atLeastOneTeamMemberHasCompletedTheirTaskToday = true;
        const teamStreakId = '123abc';
        const teamStreak = {
            _id: teamStreakId,
            currentStreak: {
                numberOfDaysInARow: 1,
            },
        };
        const updateOne = jest.fn().mockResolvedValue(true);
        const teamStreakModel = {
            updateOne,
        };
        const request: any = {};
        const response: any = { locals: { atLeastOneTeamMemberHasCompletedTheirTaskToday, teamStreak } };
        const next = jest.fn();
        const middleware = getMakeTeamStreakInactiveMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).not.toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('throws MakeTeamStreakInactiveMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const teamStreakModel = {};
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getMakeTeamStreakInactiveMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.MakeTeamStreakInactiveMiddleware, expect.any(Error)));
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
        expect(next).not.toBeCalled();
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware, expect.any(Error)));
    });
});

describe(`createIncompleteTeamMemberStreakTaskMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(18);

        expect(createIncompleteTeamMemberStreakTaskMiddlewares.length).toEqual(17);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[0]).toBe(
            incompleteTeamMemberStreakTaskBodyValidationMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[1]).toBe(teamMemberStreakExistsMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[2]).toBe(teamStreakExistsMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[3]).toBe(
            ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[4]).toBe(resetStreakStartDateMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[5]).toBe(retreiveUserMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[6]).toBe(setTaskIncompleteTimeMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[7]).toBe(setDayTaskWasIncompletedMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[8]).toBe(
            createIncompleteTeamMemberStreakTaskDefinitionMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[9]).toBe(saveTaskIncompleteMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[10]).toBe(incompleteTeamMemberStreakMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[11]).toBe(resetTeamStreakStartDateMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[12]).toBe(incompleteTeamStreakMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[13]).toBe(
            hasAtLeastOneTeamMemberCompletedTheirTaskMiddleware,
        );
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[14]).toBe(makeTeamStreakInactiveMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[15]).toBe(createTeamStreakIncompleteMiddleware);
        expect(createIncompleteTeamMemberStreakTaskMiddlewares[16]).toBe(sendTaskIncompleteResponseMiddleware);
    });
});
