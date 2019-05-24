import {
    createSoloStreakMiddlewares,
    soloStreakRegistrationValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    getCreateSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware,
    SoloStreakResponseLocals,
    createDailySoloStreakCompleteCheckerForTimezoneMiddleware,
    retreiveTimezoneHeaderMiddleware,
    validateTimezoneMiddleware,
    sendMissingTimezoneErrorResponseMiddleware,
    sendInvalidTimezoneErrorResponseMiddleware,
    getSendMissingTimezoneErrorResponseMiddleware,
    getValidateTimezoneMiddleware,
    getSendInvalidTimezoneErrorResponseMiddleware,
    getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware,
    defineEndOfDayMiddleware,
    defineCurrentTimeMiddleware,
    defineStartDayMiddleware,
    getDefineCurrentTimeMiddleware,
    getDefineStartDayMiddleware,
    getDefineEndOfDayMiddleware,
    doesTimezoneAlreadyExistMiddleware,
    getDoesTimezoneAlreadyExistMiddleware,
} from './createSoloStreakMiddlewares'
import { ResponseCodes } from '../../Server/responseCodes';
import { SupportedRequestHeaders } from '../../Server/headers';
import { AgendaProcessTimes } from '../../Agenda/agenda';
import { SoloStreak } from '../../Models/SoloStreak';

describe(`soloStreakRegistrationValidationMiddlware`, () => {

    const userId = '12345678'
    const name = 'Spanish Streak'
    const description = ' Do the insane amount of XP for Duolingo each day'

    test("that minimum amount of information needed for a streak passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, name, description }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    });

    test('that solo streak can be created', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, name, description }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    })

    test("that correct response is sent when userId is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { name, description }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when userId is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: 1234, name, description }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

    test("that correct response is sent when name is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, description }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when name is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, name: 1234, description }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

    test("that correct response is sent when description is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, name }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when description is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, name, description: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

});

describe('retreiveTimezoneHeaderMiddleware', () => {

    test('should define response.locals.timezone', () => {
        const londonTimezone = 'Europe/London'
        const header = jest.fn(() => londonTimezone)
        const request: any = {
            headers: { [SupportedRequestHeaders.xTimezone]: londonTimezone }, header
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        retreiveTimezoneHeaderMiddleware(request, response, next);

        expect.assertions(3);
        expect(header).toBeCalledWith(SupportedRequestHeaders.xTimezone)
        expect(response.locals.timezone).toEqual(londonTimezone)
        expect(next).toBeCalledWith();
    })

    test('if timezone header is missing response.locals.timezone should be undefined', () => {
        const header = jest.fn()
        const request: any = {
            headers: {}, header
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        retreiveTimezoneHeaderMiddleware(request, response, next);

        expect.assertions(2);
        expect(response.locals.timezone).toEqual(undefined)
        expect(next).toBeCalledWith();
    })

    test('should call next with error on failure', () => {
        const request: any = {
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        retreiveTimezoneHeaderMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError('request.header is not a function'));
    })
})

describe('sendMissingTimezoneErrorResponseMiddleware', () => {

    const londonTimezone = 'Europe/London'

    test('that next() is called when timezone is defined', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: { timezone: londonTimezone }
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendMissingTimezoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalled();
    })

    test('that error response is sent when timezone is not defined', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: {}
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendMissingTimezoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(3);
        expect(status).toBeCalledWith(ResponseCodes.unprocessableEntity)
        expect(send).toBeCalledWith({ message: localisedErrorMessage })
        expect(next).not.toBeCalled()
    })

    test('that next() is called with error on error', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendMissingTimezoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `timezone` of 'undefined' or 'null'."))
    })

})

describe('validateTimezoneMiddleware', () => {
    const londonTimezone = 'Europe/London'

    test('that response.locals.validTimezone is defined when timezone exists', () => {
        expect.assertions(3)
        const isValidTimezone = jest.fn(() => true)

        const request: any = {
        };
        const response: any = {
            locals: { timezone: londonTimezone }
        };
        const next = jest.fn();

        const middleware = getValidateTimezoneMiddleware(isValidTimezone)
        middleware(request, response, next)

        expect(isValidTimezone).toBeCalledWith(londonTimezone)
        expect(response.locals.validTimezone).toEqual(true)
        expect(next).toBeCalledWith();
    })

    test('that response.locals.validTimezone is null if timezone does not exist', () => {
        expect.assertions(3)
        const isValidTimezone = jest.fn(() => null)

        const request: any = {
        };
        const response: any = {
            locals: { timezone: londonTimezone }
        };
        const next = jest.fn();

        const middleware = getValidateTimezoneMiddleware(isValidTimezone)
        middleware(request, response, next)

        expect(isValidTimezone).toBeCalledWith(londonTimezone)
        expect(response.locals.validTimezone).toEqual(null)
        expect(next).toBeCalledWith();
    })

    test('that next() is called with error on error', () => {
        expect.assertions(1);
        const isValidTimezone = jest.fn(() => null)

        const request: any = {
        };
        const response: any = {
        };
        const next = jest.fn();

        const middleware = getValidateTimezoneMiddleware(isValidTimezone)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `timezone` of 'undefined' or 'null'."))
    })
})

describe('sendInvalidTimezoneErrorResponseMiddleware', () => {

    test('that next() is called when time zone is valid', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: { validTimezone: true }
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendInvalidTimezoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalled();
    })

    test('that error response is sent when time zone is invalid', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: { validTimezone: null }
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendInvalidTimezoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(3);
        expect(status).toBeCalledWith(ResponseCodes.unprocessableEntity)
        expect(send).toBeCalledWith({ message: localisedErrorMessage })
        expect(next).not.toBeCalled()
    })

    test('that next() is called with error on error', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendInvalidTimezoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `validTimezone` of 'undefined' or 'null'."))
    })

})

describe('defineCurrentTimeMiddleware', () => {
    test('that response.locals.currentTime is defined and next is called', () => {
        expect.assertions(4)
        const timezone = 'Europe/London'
        const tz = jest.fn(() => true)
        const moment = jest.fn(() => ({ tz }))
        const request: any = {}
        const response: any = { locals: { timezone } }
        const next = jest.fn()
        const middleware = getDefineCurrentTimeMiddleware(moment)
        middleware(request, response, next)
        expect(moment).toBeCalledWith()
        expect(tz).toBeCalledWith(timezone)
        expect(response.locals.currentTime).toBeDefined()
        expect(next).toBeCalledWith()
    })

    test('that on error next is called with error', () => {
        expect.assertions(1)
        const moment = jest.fn(() => ({}))
        const request: any = {}
        const response: any = { locals: {} }
        const next = jest.fn()
        const middleware = getDefineCurrentTimeMiddleware(moment)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("moment(...).tz is not a function"))
    })
})

describe('defineStartDayMiddleware', () => {

    test('that response.locals.startDay is defined and next() is called', () => {
        expect.assertions(3)
        const dayFormat = 'DD/MM/YYYY'
        const format = jest.fn(() => true)
        const currentTime = {
            format
        }
        const request: any = {}
        const response: any = { locals: { currentTime } }
        const next = jest.fn()
        const middleware = getDefineStartDayMiddleware(dayFormat)
        middleware(request, response, next)
        expect(response.locals.startDay).toBeDefined()
        expect(format).toBeCalledWith(dayFormat)
        expect(next).toBeCalledWith()
    })

    test('that on error next is called with error', () => {
        expect.assertions(1)
        const dayFormat = 'DD/MM/YYYY'
        const currentTime = {
        }
        const request: any = {}
        const response: any = { locals: { currentTime } }
        const next = jest.fn()
        const middleware = getDefineStartDayMiddleware(dayFormat)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("currentTime.format is not a function"))
    })
})

describe('defineEndOfDayMiddleware', () => {

    test('that response.locals.endOfDay is defined', () => {
        expect.assertions(4);
        const toDate = jest.fn(() => (new Date()))
        const endOf = jest.fn(() => ({ toDate }))
        const currentTime = {
            endOf
        }
        const request: any = {
        };
        const response: any = {
            locals: { currentTime }
        };
        const next = jest.fn();
        const dayTimeRange = 'day'
        const middleware = getDefineEndOfDayMiddleware(dayTimeRange)
        middleware(request, response, next)
        expect(response.locals.endOfDay).toBeDefined()
        expect(endOf).toBeCalledWith(dayTimeRange)
        expect(toDate).toBeCalled()
        expect(next).toBeCalledWith()
    })

    test('that next is called with error on failure', () => {
        expect.assertions(1);
        const endOf = jest.fn(() => ({}))
        const currentTime = {
            endOf
        }
        const request: any = {
        };
        const response: any = {
            locals: { currentTime }
        };
        const next = jest.fn();
        const dayTimeRange = 'day'
        const middleware = getDefineEndOfDayMiddleware(dayTimeRange)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError('currentTime.endOf(...).toDate is not a function'))
    })

})

describe(`createSoloStreakFromRequestMiddleware`, () => {
    test("should define response.locals.newSoloStreak", async () => {

        const userId = 'abcdefg';
        const name = 'streak name'
        const description = 'mock streak description'
        const timezone = 'Europe/London'

        class SoloStreak {
            userId: string;
            name: string;
            description: string;
            timezone: string

            constructor({ userId, name, description, timezone }) {
                this.userId = userId;
                this.name = name;
                this.description = description;
                this.timezone = timezone
            }
        }

        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, name, description } };
        const next = jest.fn();

        const middleware = getCreateSoloStreakFromRequestMiddleware(SoloStreak)

        middleware(request, response, next);

        expect.assertions(2);
        const newSoloStreak = new SoloStreak({ userId, name, description, timezone })
        expect(response.locals.newSoloStreak).toEqual(newSoloStreak)
        expect(next).toBeCalledWith()
    });

    test('should call next with error message on error', () => {

        const timezone = 'Europe/London'
        const userId = 'abcdefg';
        const name = 'streak name'
        const description = 'mock streak description'

        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, name, description } };
        const next = jest.fn();

        const middleware = getCreateSoloStreakFromRequestMiddleware({})

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("soloStreak is not a constructor"))
    })

});

describe(`saveSoloStreakToDatabaseMiddleware`, () => {

    const ERROR_MESSAGE = "error";

    test("should set response.locals.savedSoloStreak", async () => {
        const save = jest.fn(() => {
            return Promise.resolve(mockSoloStreak)
        });

        const mockSoloStreak = {
            userId: 'abcdefg',
            email: 'user@gmail.com',
            password: 'password',
            save
        }


        const response: any = { locals: { newSoloStreak: mockSoloStreak } };
        const request: any = {}
        const next = jest.fn();

        await saveSoloStreakToDatabaseMiddleware(request, response, next);

        expect.assertions(3);
        expect(save).toBeCalled();
        expect(response.locals.savedSoloStreak).toBeDefined()
        expect(next).toBeCalled();
    });

    test("should call next() with err paramater if save call fails", async () => {
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE)
        });

        const request: any = {};
        const response: any = { locals: { newSoloStreak: { save } } };
        const next = jest.fn();

        await saveSoloStreakToDatabaseMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(ERROR_MESSAGE);

    });

});

describe('doesTimezoneAlreadyExistMiddleware', () => {

    test('that response.locals.doesTimezoneAlreadyExists is defined when timezone exists', async () => {
        expect.assertions(3)
        const timezone = 'Europe/London'
        const findOne = jest.fn(() => Promise.resolve(true));
        const agendaJobModel = {
            findOne
        }
        const request: any = {}
        const response: any = { locals: { timezone } }
        const next = jest.fn()

        const middleware = getDoesTimezoneAlreadyExistMiddleware(agendaJobModel)
        await middleware(request, response, next)

        expect(findOne).toBeCalledWith({ "data.timezone": timezone })
        expect(response.locals.doesTimezoneAlreadyExist).toBeDefined()
        expect(next).toBeCalledWith()
    })

    test('that on error next is called with error', async () => {
        expect.assertions(3)
        const timezone = 'Europe/London'
        const errorMessage = 'error'
        const findOne = jest.fn(() => Promise.reject(errorMessage));
        const agendaJobModel = {
            findOne
        }
        const request: any = {}
        const response: any = { locals: { timezone } }
        const next = jest.fn()

        const middleware = getDoesTimezoneAlreadyExistMiddleware(agendaJobModel)
        await middleware(request, response, next)

        expect(findOne).toBeCalledWith({ "data.timezone": timezone })
        expect(response.locals.doesTimezoneAlreadyExist).not.toBeDefined()
        expect(next).toBeCalledWith(errorMessage)
    })

})

describe('createDailySoloStreakCompleteCheckerForTimezoneMiddleware', () => {

    test('that agenda job is created successfully when timezone does not already exist', async () => {
        expect.assertions(5)
        const timezone = 'Europe/London'
        const request: any = {}
        const endOfDay = new Date()
        const doesTimezoneAlreadyExist = null
        const response: any = { locals: { endOfDay, doesTimezoneAlreadyExist, timezone } }
        const next = jest.fn()
        const start = jest.fn(() => Promise.resolve(true))
        const repeatEvery = jest.fn(() => Promise.resolve(true))
        const save = jest.fn(() => Promise.resolve(true))
        const schedule = jest.fn(() => Promise.resolve({ save, repeatEvery }))
        const agenda = { start, schedule, save }
        const soloStreakCompleteTrackerForTimezoneJobName = 'soloStreakComplete'

        const middleware = getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware(agenda, soloStreakCompleteTrackerForTimezoneJobName)
        await middleware(request, response, next)

        expect(schedule).toBeCalledWith(endOfDay, soloStreakCompleteTrackerForTimezoneJobName, { timezone })
        expect(start).toBeCalledWith()
        expect(repeatEvery).toBeCalledWith(AgendaProcessTimes.day)
        expect(save).toBeCalledWith()
        expect(next).toBeCalledWith()
    })

    test('that agenda job is not created when timezone already exists', async () => {
        expect.assertions(1)
        const timezone = 'Europe/London'
        const endOfDay = new Date()
        const doesTimezoneAlreadyExist = true
        const request: any = {}
        const response: any = { locals: { endOfDay, doesTimezoneAlreadyExist, timezone } }
        const next = jest.fn()
        const agenda = {}
        const soloStreakCompleteTrackerForTimezoneJobName = 'soloStreakComplete'

        const middleware = getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware(agenda, soloStreakCompleteTrackerForTimezoneJobName)
        await middleware(request, response, next)

        expect(next).toBeCalledWith()
    })

    test('that next is called with error message on failure', async () => {
        expect.assertions(1)
        const request: any = {}
        const endOfDay = new Date()
        const response: any = { locals: { endOfDay } }
        const next = jest.fn()
        const agenda = {}
        const soloStreakCompleteTrackerForTimezoneJobName = 'soloStreakComplete'

        const middleware = getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware(agenda, soloStreakCompleteTrackerForTimezoneJobName)
        await middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("agenda.start is not a function"))
    })
})

describe(`sendFormattedSoloStreakMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    const savedSoloStreak = { userId: 'abc', streakName: 'Daily Spanish', streakDescription: 'Practice spanish every day', startDate: new Date() } as SoloStreak

    test("should send user in response with password undefined", () => {

        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const soloStreakResponseLocals: SoloStreakResponseLocals = { savedSoloStreak }
        const response: any = { locals: soloStreakResponseLocals, status };

        const request: any = {}
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect.assertions(4);
        expect(response.locals.user).toBeUndefined()
        expect(next).not.toBeCalled()
        expect(status).toBeCalledWith(ResponseCodes.created)
        expect(send).toBeCalledWith(savedSoloStreak)
    });

    test("should call next with an error on failure", () => {

        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const status = jest.fn(() => ({ send }))
        const response: any = { locals: { savedSoloStreak }, status };

        const request: any = {}
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })
});

describe(`createSoloStreakMiddlewares`, () => {
    test("that createSoloStreak middlewares are defined in the correct order", async () => {
        expect.assertions(14);
        expect(createSoloStreakMiddlewares.length).toEqual(13)
        expect(createSoloStreakMiddlewares[0]).toBe(soloStreakRegistrationValidationMiddleware)
        expect(createSoloStreakMiddlewares[1]).toBe(retreiveTimezoneHeaderMiddleware)
        expect(createSoloStreakMiddlewares[2]).toBe(sendMissingTimezoneErrorResponseMiddleware)
        expect(createSoloStreakMiddlewares[3]).toBe(validateTimezoneMiddleware)
        expect(createSoloStreakMiddlewares[4]).toBe(sendInvalidTimezoneErrorResponseMiddleware)
        expect(createSoloStreakMiddlewares[5]).toBe(defineCurrentTimeMiddleware)
        expect(createSoloStreakMiddlewares[6]).toBe(defineStartDayMiddleware)
        expect(createSoloStreakMiddlewares[7]).toBe(defineEndOfDayMiddleware)
        expect(createSoloStreakMiddlewares[8]).toBe(createSoloStreakFromRequestMiddleware)
        expect(createSoloStreakMiddlewares[9]).toBe(saveSoloStreakToDatabaseMiddleware)
        expect(createSoloStreakMiddlewares[10]).toBe(doesTimezoneAlreadyExistMiddleware)
        expect(createSoloStreakMiddlewares[11]).toBe(createDailySoloStreakCompleteCheckerForTimezoneMiddleware)
        expect(createSoloStreakMiddlewares[12]).toBe(sendFormattedSoloStreakMiddleware)
    });
});
