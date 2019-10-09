/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createIncompleteSoloStreakTaskMiddlewares,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteSoloStreakTaskDefinitionMiddleware,
    soloStreakExistsMiddleware,
    saveTaskIncompleteMiddleware,
    getIncompleteSoloStreakMiddleware,
    getSoloStreakExistsMiddleware,
    getRetreiveUserMiddleware,
    getSetDayTaskWasIncompletedMiddleware,
    getSetTaskIncompleteTimeMiddleware,
    getSaveTaskIncompleteMiddleware,
    incompleteSoloStreakMiddleware,
    getSendTaskIncompleteResponseMiddleware,
    incompleteSoloStreakTaskBodyValidationMiddleware,
    ensureSoloStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    getResetStreakStartDateMiddleware,
} from './createIncompleteSoloStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`incompleteSoloStreakTaskBodyValidationMiddleware`, () => {
    const userId = 'abcdefgh';
    const soloStreakId = '123456';

    test('calls next() when correct body is supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { userId, soloStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteSoloStreakTaskBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct error response when userId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { soloStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteSoloStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when soloStreakId is missing', () => {
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

        incompleteSoloStreakTaskBodyValidationMiddleware(request, response, next);

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
            body: { soloStreakId: 1234, userId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteSoloStreakTaskBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('soloStreakExistsMiddleware', () => {
    test('sets response.locals.soloStreak and calls next()', async () => {
        expect.assertions(3);
        const soloStreakId = 'abc';
        const request: any = {
            body: { soloStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = { findOne };
        const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: soloStreakId });
        expect(response.locals.soloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist error when solo streak does not exist', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc';
        const request: any = {
            body: { soloStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(false));
        const soloStreakModel = { findOne };
        const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist));
    });

    test('throws CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const findOne = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = { findOne };
        const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware, expect.any(Error)),
        );
    });
});

describe('ensureSoloStreakTaskHasBeenCompletedTodayMiddleware', () => {
    test('if soloStreak.completedToday is true it calls next middleware', () => {
        const soloStreak = {
            completedToday: true,
        };
        const request: any = {};
        const response: any = { locals: { soloStreak } };
        const next = jest.fn();

        ensureSoloStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if soloStreak.completedToday is false it throws SoloStreakHasNotBeenCompletedToday error message', () => {
        const soloStreak = {
            completedToday: false,
        };
        const request: any = {};
        const response: any = { locals: { soloStreak } };
        const next = jest.fn();

        ensureSoloStreakTaskHasBeenCompletedTodayMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SoloStreakHasNotBeenCompletedToday));
    });

    test('throws EnsureSoloStreakTaskHasBeeenCompletedTodayMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.EnsureSoloStreakTaskHasBeenCompletedTodayMiddleware, expect.any(Error)),
        );
    });
});

describe('resetStreakStartDateMiddleware', () => {
    test('if currentStreak number of days is 0 and this is the first streak it resets the current streak', async () => {
        expect.assertions(2);
        const updateOne = jest.fn().mockResolvedValue(true);
        const soloStreakModel: any = {
            updateOne,
        };
        const soloStreakId = 1;
        const soloStreak = {
            _id: soloStreakId,
            currentStreak: {
                startDate: undefined,
                numberOfDaysInARow: 0,
            },
            pastStreaks: [],
        };
        const request: any = {};
        const response: any = { locals: { soloStreak } };
        const next: any = jest.fn();
        const middleware = await getResetStreakStartDateMiddleware(soloStreakModel);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: soloStreakId },
            {
                currentStreak: { startDate: null, numberOfDaysInARow: 0 },
            },
        );
        expect(next).toBeCalledWith();
    });

    test("doesn't update soloStreak in number of days in a row > 0", async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn();
        const soloStreakModel: any = {
            findByIdAndUpdate,
        };
        const soloStreakId = 1;
        const soloStreak = {
            currentStreak: {
                startDate: new Date(),
                numberOfDaysInARow: 1,
            },
        };
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: { soloStreak } };
        const next: any = jest.fn();
        const middleware = await getResetStreakStartDateMiddleware(soloStreakModel);

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

    test('throws CreateIncompleteSoloStreakTaskUserDoesNotExist when user does not exist', async () => {
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

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateIncompleteSoloStreakTaskUserDoesNotExist));
    });

    test('throws CreateIncompleteSoloStreakTaskRetreiveUserMiddleware error on middleware failure', async () => {
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
            new CustomError(ErrorType.CreateIncompleteSoloStreakTaskRetreiveUserMiddleware, expect.any(Error)),
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

describe('createIncompleteSoloStreakTaskDefinitionMiddleware', () => {
    test('sets incompleteSoloStreakTaskDefinition and calls next()', () => {
        expect.assertions(3);
        const soloStreakId = 'abcd123';
        const toDate = jest.fn(() => '27/03/2019');
        const taskIncompleteTime = {
            toDate,
        };
        const taskIncompleteDay = '09/05/2019';
        const userId = 'abc';
        const request: any = {
            body: { userId, soloStreakId },
        };
        const response: any = {
            locals: {
                taskIncompleteTime,
                taskIncompleteDay,
            },
        };
        const next = jest.fn();

        createIncompleteSoloStreakTaskDefinitionMiddleware(request, response, next);

        expect(response.locals.incompleteSoloStreakTaskDefinition).toEqual({
            userId,
            streakId: soloStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
        });
        expect(toDate).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateIncompleteSoloStreakTaskDefinitionMiddlware error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        createIncompleteSoloStreakTaskDefinitionMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateIncompleteSoloStreakTaskDefinitionMiddleware, expect.any(Error)),
        );
    });
});

describe(`saveTaskIncompleteMiddleware`, () => {
    test('sets response.locals.incompleteSoloStreakTask and calls next', async () => {
        expect.assertions(3);
        const userId = 'abcd';
        const streakId = '1234';
        const taskIncompleteTime = new Date();
        const taskIncompleteDay = '09/05/2019';
        const streakType = 'soloStreak';
        const incompleteSoloStreakTaskDefinition = {
            userId,
            streakId,
            taskIncompleteTime,
            taskIncompleteDay,
            streakType,
        };
        const save = jest.fn(() => Promise.resolve(true));
        class IncompleteSoloStreakTaskModel {
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
        const response: any = { locals: { incompleteSoloStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskIncompleteMiddleware(IncompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(response.locals.incompleteSoloStreakTask).toBeDefined();
        expect(save).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws SaveTaskIncompleteMiddleware error on Middleware failure', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const streakId = '1234';
        const taskIncompleteTime = new Date();
        const taskIncompleteDay = '09/05/2019';
        const streakType = 'soloStreak';
        const incompleteSoloStreakTaskDefinition = {
            userId,
            streakId,
            taskIncompleteTime,
            taskIncompleteDay,
            streakType,
        };
        const request: any = {};
        const response: any = { locals: { incompleteSoloStreakTaskDefinition } };
        const next = jest.fn();
        const middleware = getSaveTaskIncompleteMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveTaskIncompleteMiddleware, expect.any(Error)));
    });
});

describe('incompleteSoloStreakMiddleware', () => {
    test('updates streak completedToday, descrements number of days, sets active to false and calls next', async () => {
        expect.assertions(2);
        const soloStreakId = '123abc';
        const updateOne = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            updateOne,
        };
        const request: any = { body: { soloStreakId } };
        const response: any = {};
        const next = jest.fn();
        const middleware = getIncompleteSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(updateOne).toBeCalledWith(
            { _id: soloStreakId },
            {
                completedToday: false,
                $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                active: false,
            },
        );
        expect(next).toBeCalledWith();
    });

    test('throws IncompleteSoloStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const soloStreakModel = {};
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getIncompleteSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.IncompleteSoloStreakMiddleware, expect.any(Error)));
    });
});

describe('sendTaskIncompleteResponseMiddleware', () => {
    test('sends incompleteSoloStreakTask response', () => {
        expect.assertions(3);
        const send = jest.fn(() => true);
        const status = jest.fn(() => ({ send }));
        const incompleteSoloStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskIncompleteTime: new Date(),
            taskIncompleteDay: '10/05/2019',
            streakType: 'solo-streak',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { incompleteSoloStreakTask }, status };
        const next = jest.fn();

        middleware(request, response, next);

        expect(status).toBeCalledWith(successResponseCode);
        expect(send).toBeCalledWith(incompleteSoloStreakTask);
        expect(next).not.toBeCalled();
    });

    test('throws SendTaskIncompleteResponseMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const incompleteSoloStreakTask = {
            userId: 'abcd',
            streakId: '1234',
            taskIncompleteTime: new Date(),
            taskIncompleteDay: '10/05/2019',
            streakType: 'solo-streak',
        };
        const successResponseCode = 200;
        const middleware = getSendTaskIncompleteResponseMiddleware(successResponseCode);
        const request: any = {};
        const response: any = { locals: { incompleteSoloStreakTask } };
        const next = jest.fn();

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware, expect.any(Error)));
    });
});

describe(`createIncompleteSoloStreakTaskMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(12);

        expect(createIncompleteSoloStreakTaskMiddlewares.length).toEqual(11);
        expect(createIncompleteSoloStreakTaskMiddlewares[0]).toBe(incompleteSoloStreakTaskBodyValidationMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[1]).toBe(soloStreakExistsMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[2]).toBe(ensureSoloStreakTaskHasBeenCompletedTodayMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[3]).toBe(resetStreakStartDateMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[4]).toBe(retreiveUserMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[5]).toBe(setTaskIncompleteTimeMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[6]).toBe(setDayTaskWasIncompletedMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[7]).toBe(createIncompleteSoloStreakTaskDefinitionMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[8]).toBe(saveTaskIncompleteMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[9]).toBe(incompleteSoloStreakMiddleware);
        expect(createIncompleteSoloStreakTaskMiddlewares[10]).toBe(sendTaskIncompleteResponseMiddleware);
    });
});
