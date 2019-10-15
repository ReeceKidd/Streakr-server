/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createCompleteTeamStreakTaskMiddlewares,
    setTaskCompleteTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    sendTaskCompleteResponseMiddleware,
    createCompleteTeamStreakTaskDefinitionMiddleware,
    teamStreakExistsMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    getTeamStreakExistsMiddleware,
    getSetDayTaskWasCompletedMiddleware,
    getSetTaskCompleteTimeMiddleware,
    getSaveTaskCompleteMiddleware,
    getStreakMaintainedMiddleware,
    getSendTaskCompleteResponseMiddleware,
    setStreakStartDateMiddleware,
    getSetStreakStartDateMiddleware,
    completeTeamStreakTaskBodyValidationMiddleware,
    ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware,
} from './createCompleteTeamStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`completeTeamStreakTaskBodyValidationMiddleware`, () => {
    const teamStreakId = '123456';

    test('calls next() when correct body is supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { teamStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamStreakTaskBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct error response when teamStreakId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when teamStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { teamStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" must be a string]',
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

    test('throws CreateCompleteTeamStreakTaskTeamStreakDoesNotExist error when team streak does not exist', async () => {
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateCompleteTeamStreakTaskTeamStreakDoesNotExist));
    });

    test('throws CreateCompleteTeamStreakTaskTeamStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const teamStreakModel = { findOne };
        const middleware = getTeamStreakExistsMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskTeamStreakExistsMiddleware, expect.any(Error)),
        );
    });
});

describe('ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware', () => {
    test('if teamStreak.completedToday is false it calls the next middleware', () => {
        const teamStreak = {
            completedToday: false,
        };
        const request: any = {};
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();

        ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if teamStreak.completedToday is true it throws TeamStreakHasBeenCompletedToday error message', () => {
        const teamStreak = {
            completedToday: true,
        };
        const request: any = {};
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();

        ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.TeamStreakHasBeenCompletedToday));
    });

    test('throws EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware, expect.any(Error)),
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

    test('throws CreateCompleteTeamStreakTaskSetTaskCompleteTimeMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const tz = jest.fn(() => true);
        const moment = jest.fn(() => ({ tz }));
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getSetTaskCompleteTimeMiddleware(moment);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskSetTaskCompleteTimeMiddleware, expect.any(Error)),
        );
    });
});

describe('setStreakStartDateMiddleware', () => {
    test("sets teamStreak.startDate to taskCompleteTime if it's undefined and calls next()", async () => {
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
        const request: any = {};
        const response: any = { locals: { teamStreak, taskCompleteTime } };
        const next: any = jest.fn();
        const middleware = await getSetStreakStartDateMiddleware(teamStreakModel);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: teamStreakId },
            {
                currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 },
            },
        );
        expect(next).toBeCalledWith();
    });

    test("doesn't update teamStreak currentStreak.startDate if it's already set", async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn();
        const teamStreakModel: any = {
            findByIdAndUpdate,
        };
        const taskCompleteTime = new Date();
        const teamStreakId = 1;
        const teamStreak = {
            currentStreak: {
                startDate: new Date(),
            },
        };
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: { teamStreak, taskCompleteTime } };
        const next: any = jest.fn();
        const middleware = await getSetStreakStartDateMiddleware(teamStreakModel);

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
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskSetStreakStartDateMiddleware, expect.any(Error)),
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

    test('throws CreateCompleteTeamStreakTaskSetDayTaskWasCompletedMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const dayFormat = 'DD/MM/YYYY';
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskSetDayTaskWasCompletedMiddleware, expect.any(Error)),
        );
    });
});

describe('createCompleteTeamStreakTaskDefinitionMiddleware', () => {
    test('sets completeTeamStreakTaskDefinition and calls next()', () => {
        expect.assertions(3);
        const teamStreakId = 'abcd123';
        const toDate = jest.fn(() => '27/03/2019');
        const taskCompleteTime = {
            toDate,
        };
        const taskCompleteDay = '09/05/2019';
        const request: any = {
            body: { teamStreakId },
        };
        const response: any = {
            locals: {
                taskCompleteTime,
                taskCompleteDay,
            },
        };
        const next = jest.fn();

        createCompleteTeamStreakTaskDefinitionMiddleware(request, response, next);

        expect(response.locals.completeTeamStreakTaskDefinition).toEqual({
            teamStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        });
        expect(toDate).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateCompleteTeamStreakTaskDefinitionMiddlware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        createCompleteTeamStreakTaskDefinitionMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskDefinitionMiddleware, expect.any(Error)),
        );
    });
});

describe(`saveTaskCompleteMiddleware`, () => {
    test('sets response.locals.completeTeamStreakTask and calls next', async () => {
        expect.assertions(3);
        const streakId = '1234';
        const taskCompleteTime = new Date();
        const taskCompleteDay = '09/05/2019';
        const streakType = 'teamStreak';
        const completeTeamStreakTaskDefinition = {
            streakId,
            taskCompleteTime,
            taskCompleteDay,
            streakType,
        };
        const save = jest.fn(() => Promise.resolve(true));
        class CompleteTeamStreakTaskModel {
            streakId: string;
            taskCompleteTime: Date;
            taskCompleteDay: string;
            streakType: string;

            constructor(streakId: string, taskCompleteTime: Date, taskCompleteDay: string, streakType: string) {
                (this.streakId = streakId), (this.taskCompleteTime = taskCompleteTime);
                this.taskCompleteDay = taskCompleteDay;
                this.streakType = streakType;
            }

            save() {
                return save();
            }
        }
        const request: any = {};
        const response: any = { locals: { completeTeamStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskCompleteMiddleware(CompleteTeamStreakTaskModel as any);

        await middleware(request, response, next);

        expect(response.locals.completeTeamStreakTask).toBeDefined();
        expect(save).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateCompleteTeamStreakTaskSaveTaskCompleteMiddleware error on Middleware failure', async () => {
        expect.assertions(1);
        const streakId = '1234';
        const taskCompleteTime = new Date();
        const taskCompleteDay = '09/05/2019';
        const streakType = 'teamStreak';
        const completeTeamStreakTaskDefinition = {
            streakId,
            taskCompleteTime,
            taskCompleteDay,
            streakType,
        };
        const request: any = {};
        const response: any = { locals: { completeTeamStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskCompleteMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskSaveTaskCompleteMiddleware, expect.any(Error)),
        );
    });
});

describe('streakMaintainedMiddleware', () => {
    test('updates streak completedToday, increments number of days, sets active and calls next', async () => {
        expect.assertions(2);
        const teamStreakId = '123abc';
        const updateOne = jest.fn(() => Promise.resolve(true));
        const teamStreakModel = {
            updateOne,
        };
        const request: any = { body: { teamStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getStreakMaintainedMiddleware(teamStreakModel as any);

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

    test('throws CreateCompleteTeamStreakTaskStreakMaintainedMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const teamStreakId = '123abc';
        const teamStreakModel = {};
        const request: any = { params: { teamStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getStreakMaintainedMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateCompleteTeamStreakTaskStreakMaintainedMiddleware, expect.any(Error)),
        );
    });
});

describe('sendTaskCompleteResponseMiddleware', () => {
    test('sends completeTeamStreakTask response', () => {
        expect.assertions(3);
        const send = jest.fn(() => true);
        const status = jest.fn(() => ({ send }));
        const completeTeamStreakTask = {
            streakId: '1234',
            taskCompleteTime: new Date(),
            taskCompleteDay: '10/05/2019',
            streakType: 'team-streak',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskCompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { completeTeamStreakTask }, status };
        const next = jest.fn();

        middleware(request, response, next);

        expect(status).toBeCalledWith(successResponseCode);
        expect(send).toBeCalledWith(completeTeamStreakTask);
        expect(next).not.toBeCalled();
    });

    test('throws CreateCompleteTeamStreakTaskSendTaskCompleteResponseMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const completeTeamStreakTask = {
            streakId: '1234',
            taskCompleteTime: new Date(),
            taskCompleteDay: '10/05/2019',
            streakType: 'team-streak',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskCompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { completeTeamStreakTask } };
        const next = jest.fn();

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(
                ErrorType.CreateCompleteTeamStreakTaskSendTaskCompleteResponseMiddleware,
                expect.any(Error),
            ),
        );
    });
});

describe(`createCompleteTeamStreakTaskMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(11);

        expect(createCompleteTeamStreakTaskMiddlewares.length).toEqual(10);
        expect(createCompleteTeamStreakTaskMiddlewares[0]).toBe(completeTeamStreakTaskBodyValidationMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[1]).toBe(teamStreakExistsMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[2]).toBe(ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[3]).toBe(setTaskCompleteTimeMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[4]).toBe(setStreakStartDateMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[5]).toBe(setDayTaskWasCompletedMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[6]).toBe(createCompleteTeamStreakTaskDefinitionMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[7]).toBe(saveTaskCompleteMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[8]).toBe(streakMaintainedMiddleware);
        expect(createCompleteTeamStreakTaskMiddlewares[9]).toBe(sendTaskCompleteResponseMiddleware);
    });
});
