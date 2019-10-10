/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createIncompleteGroupMemberStreakTaskMiddlewares,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteGroupMemberStreakTaskDefinitionMiddleware,
    groupMemberStreakExistsMiddleware,
    saveTaskIncompleteMiddleware,
    getIncompleteGroupMemberStreakMiddleware,
    getGroupMemberStreakExistsMiddleware,
    getRetreiveUserMiddleware,
    getSetDayTaskWasIncompletedMiddleware,
    getSetTaskIncompleteTimeMiddleware,
    getSaveTaskIncompleteMiddleware,
    incompleteGroupMemberStreakMiddleware,
    getSendTaskIncompleteResponseMiddleware,
    incompleteGroupMemberStreakTaskBodyValidationMiddleware,
    ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    getResetStreakStartDateMiddleware,
} from './createIncompleteGroupMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

describe(`incompleteGroupMemberStreakTaskBodyValidationMiddleware`, () => {
    const userId = 'abcdefgh';
    const groupMemberStreakId = '123456';
    const groupStreakType = GroupStreakTypes.team;
    const teamStreakId = 'teamStreakId';

    const body = {
        userId,
        groupMemberStreakId,
        groupStreakType,
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

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

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

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when groupMemberStreakId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, groupMemberStreakId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupMemberStreakId" fails because ["groupMemberStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when groupMemberStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, groupMemberStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupMemberStreakId" fails because ["groupMemberStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when groupStreakType is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, groupStreakType: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupStreakType" fails because ["groupStreakType" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when groupStreakType is invalid', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, groupStreakType: 'invalid' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupStreakType" fails because ["groupStreakType" must be one of [team, competition]]',
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

        incompleteGroupMemberStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('groupMemberStreakExistsMiddleware', () => {
    test('sets response.locals.groupMemberStreak and calls next()', async () => {
        expect.assertions(3);
        const groupMemberStreakId = 'abc';
        const request: any = {
            body: { groupMemberStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const groupMemberStreakModel = { findOne };
        const middleware = getGroupMemberStreakExistsMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: groupMemberStreakId });
        expect(response.locals.groupMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws CreateIncompleteGroupMemberStreakTaskGroupMemberStreakDoesNotExist error when solo streak does not exist', async () => {
        expect.assertions(1);
        const groupMemberStreakId = 'abc';
        const request: any = {
            body: { groupMemberStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(false));
        const groupMemberStreakModel = { findOne };
        const middleware = getGroupMemberStreakExistsMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskGroupMemberStreakDoesNotExist),
        );
    });

    test('throws CreateIncompleteGroupMemberStreakTaskGroupMemberStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const groupMemberStreakModel = { findOne };
        const middleware = getGroupMemberStreakExistsMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(
                ErrorType.CreateIncompleteGroupMemberStreakTaskGroupMemberStreakExistsMiddleware,
                expect.any(Error),
            ),
        );
    });
});

describe('ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware', () => {
    test('if groupMemberStreak.completedToday is true it calls next middleware', () => {
        const groupMemberStreak = {
            completedToday: true,
        };
        const request: any = {};
        const response: any = { locals: { groupMemberStreak } };
        const next = jest.fn();

        ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if groupMemberStreak.completedToday is false it throws GroupMemberStreakHasNotBeenCompletedToday error message', () => {
        const groupMemberStreak = {
            completedToday: false,
        };
        const request: any = {};
        const response: any = { locals: { groupMemberStreak } };
        const next = jest.fn();

        ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GroupMemberStreakHasNotBeenCompletedToday));
    });

    test('throws EnsureGroupMemberStreakTaskHasBeeenCompletedTodayMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.EnsureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware, expect.any(Error)),
        );
    });
});

describe('resetStreakStartDateMiddleware', () => {
    test('if currentStreak number of days is 1 and this is the first streak it resets the current streak', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const groupMemberStreakModel: any = {
            findByIdAndUpdate,
        };
        const groupMemberStreakId = 1;
        const groupMemberStreak = {
            _id: groupMemberStreakId,
            currentStreak: {
                startDate: undefined,
                numberOfDaysInARow: 1,
            },
            pastStreaks: [],
        };
        const request: any = {};
        const response: any = { locals: { groupMemberStreak } };
        const next: any = jest.fn();
        const middleware = await getResetStreakStartDateMiddleware(groupMemberStreakModel);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            groupMemberStreakId,
            {
                currentStreak: { startDate: null, numberOfDaysInARow: 0 },
            },
            { new: true },
        );
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test("doesn't update groupMemberStreak in number of days in a row > 1", async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn();
        const groupMemberStreakModel: any = {
            findByIdAndUpdate,
        };
        const groupMemberStreakId = 2;
        const groupMemberStreak = {
            currentStreak: {
                startDate: new Date(),
                numberOfDaysInARow: 2,
            },
        };
        const request: any = { params: { groupMemberStreakId } };
        const response: any = { locals: { groupMemberStreak } };
        const next: any = jest.fn();
        const middleware = await getResetStreakStartDateMiddleware(groupMemberStreakModel);

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

    test('throws CreateIncompleteGroupMemberStreakTaskUserDoesNotExist when user does not exist', async () => {
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskUserDoesNotExist));
    });

    test('throws CreateIncompleteGroupMemberStreakTaskRetreiveUserMiddleware error on middleware failure', async () => {
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
            new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskRetreiveUserMiddleware, expect.any(Error)),
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

describe('createIncompleteGroupMemberStreakTaskDefinitionMiddleware', () => {
    test('sets incompleteGroupMemberStreakTaskDefinition and calls next()', () => {
        expect.assertions(3);
        const groupMemberStreakId = 'abcd123';
        const groupStreakType = GroupStreakTypes.team;
        const teamStreakId = 'teamStreakId';
        const toDate = jest.fn(() => '27/03/2019');
        const taskIncompleteTime = {
            toDate,
        };
        const taskIncompleteDay = '09/05/2019';
        const userId = 'abc';
        const request: any = {
            body: { userId, groupMemberStreakId, groupStreakType, teamStreakId },
        };
        const response: any = {
            locals: {
                taskIncompleteTime,
                taskIncompleteDay,
            },
        };
        const next = jest.fn();

        createIncompleteGroupMemberStreakTaskDefinitionMiddleware(request, response, next);

        expect(response.locals.incompleteGroupMemberStreakTaskDefinition).toEqual({
            userId,
            groupMemberStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
            groupStreakType,
            teamStreakId,
        });
        expect(toDate).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateIncompleteGroupMemberStreakTaskDefinitionMiddlware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        createIncompleteGroupMemberStreakTaskDefinitionMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskDefinitionMiddleware, expect.any(Error)),
        );
    });
});

describe(`saveTaskIncompleteMiddleware`, () => {
    test('sets response.locals.incompleteGroupMemberStreakTask and calls next', async () => {
        expect.assertions(3);
        const userId = 'abcd';
        const streakId = '1234';
        const taskIncompleteTime = new Date();
        const taskIncompleteDay = '09/05/2019';
        const streakType = 'groupMemberStreak';
        const incompleteGroupMemberStreakTaskDefinition = {
            userId,
            streakId,
            taskIncompleteTime,
            taskIncompleteDay,
            streakType,
        };
        const save = jest.fn(() => Promise.resolve(true));
        class IncompleteGroupMemberStreakTaskModel {
            userId: string;
            streakId: string;
            taskIncompleteTime: Date;
            taskIncompleteDay: string;
            streakType: string;

            constructor(
                userId: string,
                streakId: string,
                taskIncompleteTime: Date,
                taskIncompleteDay: string,
                streakType: string,
            ) {
                this.userId = userId;
                (this.streakId = streakId), (this.taskIncompleteTime = taskIncompleteTime);
                this.taskIncompleteDay = taskIncompleteDay;
                this.streakType = streakType;
            }

            save() {
                return save();
            }
        }
        const request: any = {};
        const response: any = { locals: { incompleteGroupMemberStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskIncompleteMiddleware(IncompleteGroupMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(response.locals.incompleteGroupMemberStreakTask).toBeDefined();
        expect(save).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws SaveTaskIncompleteMiddleware error on Middleware failure', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const streakId = '1234';
        const taskIncompleteTime = new Date();
        const taskIncompleteDay = '09/05/2019';
        const streakType = 'groupMemberStreak';
        const incompleteGroupMemberStreakTaskDefinition = {
            userId,
            streakId,
            taskIncompleteTime,
            taskIncompleteDay,
            streakType,
        };
        const request: any = {};
        const response: any = { locals: { incompleteGroupMemberStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskIncompleteMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveTaskIncompleteMiddleware, expect.any(Error)));
    });
});

describe('incompleteGroupMemberStreakMiddleware', () => {
    test('if number of days in a row of current streak is not equal to 0 it updates streak completedToday, descrements number of days by one, sets active to false and calls next', async () => {
        expect.assertions(2);
        const groupMemberStreakId = '123abc';
        const groupMemberStreak = {
            _id: groupMemberStreakId,
            currentStreak: {
                numberOfDaysInARow: 1,
            },
        };
        const updateOne = jest.fn(() => Promise.resolve(true));
        const groupMemberStreakModel = {
            updateOne,
        };
        const request: any = {};
        const response: any = { locals: { groupMemberStreak } };
        const next = jest.fn();
        const middleware = getIncompleteGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: groupMemberStreakId },
            {
                completedToday: false,
                $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                active: false,
            },
        );
        expect(next).toBeCalledWith();
    });

    test('if number of days in a row of current streak is equal to 0 it updates streak completedToday, set currentStreak.numberOfDays in a row to 0, sets active to false and calls next', async () => {
        expect.assertions(2);
        const groupMemberStreakId = '123abc';
        const groupMemberStreak = {
            _id: groupMemberStreakId,
            currentStreak: {
                numberOfDaysInARow: 1,
            },
        };
        const updateOne = jest.fn(() => Promise.resolve(true));
        const groupMemberStreakModel = {
            updateOne,
        };
        const request: any = {};
        const response: any = { locals: { groupMemberStreak } };
        const next = jest.fn();
        const middleware = getIncompleteGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: groupMemberStreakId },
            {
                completedToday: false,
                $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                active: false,
            },
        );
        expect(next).toBeCalledWith();
    });

    test('throws IncompleteGroupMemberStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const groupMemberStreakModel = {};
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getIncompleteGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.IncompleteGroupMemberStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('sendTaskIncompleteResponseMiddleware', () => {
    test('sends incompleteGroupMemberStreakTask response', () => {
        expect.assertions(3);
        const send = jest.fn(() => true);
        const status = jest.fn(() => ({ send }));
        const incompleteGroupMemberStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskIncompleteTime: new Date(),
            taskIncompleteDay: '10/05/2019',
            streakType: 'solo-streak',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { incompleteGroupMemberStreakTask }, status };
        const next = jest.fn();

        middleware(request, response, next);

        expect(status).toBeCalledWith(successResponseCode);
        expect(send).toBeCalledWith(incompleteGroupMemberStreakTask);
        expect(next).not.toBeCalled();
    });

    test('throws SendTaskIncompleteResponseMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const incompleteGroupMemberStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskIncompleteTime: new Date(),
            taskIncompleteDay: '10/05/2019',
            streakType: 'solo-streak',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { incompleteGroupMemberStreakTask } };
        const next = jest.fn();

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware, expect.any(Error)));
    });
});

describe(`createIncompleteGroupMemberStreakTaskMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(12);

        expect(createIncompleteGroupMemberStreakTaskMiddlewares.length).toEqual(11);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[0]).toBe(
            incompleteGroupMemberStreakTaskBodyValidationMiddleware,
        );
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[1]).toBe(groupMemberStreakExistsMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[2]).toBe(
            ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware,
        );
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[3]).toBe(resetStreakStartDateMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[4]).toBe(retreiveUserMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[5]).toBe(setTaskIncompleteTimeMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[6]).toBe(setDayTaskWasIncompletedMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[7]).toBe(
            createIncompleteGroupMemberStreakTaskDefinitionMiddleware,
        );
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[8]).toBe(saveTaskIncompleteMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[9]).toBe(incompleteGroupMemberStreakMiddleware);
        expect(createIncompleteGroupMemberStreakTaskMiddlewares[10]).toBe(sendTaskIncompleteResponseMiddleware);
    });
});
