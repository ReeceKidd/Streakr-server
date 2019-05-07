import {
    createSoloStreakMiddlewares,
    soloStreakRegistrationValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    getCreateSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware,
    SoloStreakResponseLocals,
    createDailySoloStreakCompleteChecker,
    retreiveTimeZoneHeaderMiddleware,
    validateTimeZoneMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    getSendMissingTimeZoneErrorResponseMiddleware,
    getValidateTimeZoneMiddleware,
    getSendInvalidTimeZoneErrorResponseMiddleware,
    getCreateDailySoloStreakCompleteChecker,
    defineEndOfDayMiddleware,
    defineCurrentTimeMiddleware,
    defineStartDayMiddleware,
    getDefineCurrentTimeMiddleware,
    getDefineStartDayMiddleware,
    getDefineEndOfDayMiddleware,
} from './createSoloStreakMiddlewares'
import { ResponseCodes } from '../../Server/responseCodes';
import { SupportedRequestHeaders } from '../../Server/headers';
import { AgendaJobs, AgendaProcessTimes, AgendaTimeRanges } from '../../../config/Agenda';
import { SoloStreak } from 'Models/SoloStreak';

describe(`soloStreakRegistrationValidationMiddlware`, () => {

    const userId = '12345678'
    const name = 'Spanish Streak'
    const description = ' Do the insane amount of XP for Duolingo each day'

    test("that minimum amount of information needed for a sterak passes", () => {
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

describe('retreiveTimeZoneHeaderMiddleware', () => {

    test('should define response.locals.timeZone', () => {
        const londonTimeZone = 'Europe/London'
        const header = jest.fn(() => londonTimeZone)
        const request: any = {
            headers: { [SupportedRequestHeaders.xTimeZone]: londonTimeZone }, header
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        retreiveTimeZoneHeaderMiddleware(request, response, next);

        expect.assertions(3);
        expect(header).toBeCalledWith(SupportedRequestHeaders.xTimeZone)
        expect(response.locals.timeZone).toEqual(londonTimeZone)
        expect(next).toBeCalledWith();
    })

    test('if timeZone header is missing response.locals.timeZone should be undefined', () => {
        const header = jest.fn()
        const request: any = {
            headers: {}, header
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        retreiveTimeZoneHeaderMiddleware(request, response, next);

        expect.assertions(2);
        expect(response.locals.timeZone).toEqual(undefined)
        expect(next).toBeCalledWith();
    })

    test('should call next with error on failure', () => {
        const request: any = {
        };
        const response: any = {
            locals: {}
        };
        const next = jest.fn();

        retreiveTimeZoneHeaderMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError('request.header is not a function'));
    })
})

describe('sendMissingTimeZoneErrorResponseMiddleware', () => {

    const londonTimeZone = 'Europe/London'

    test('that next() is called when timeZone is defined', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: { timeZone: londonTimeZone }
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendMissingTimeZoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalled();
    })

    test('that error response is sent when timeZone is not defined', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: {}
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendMissingTimeZoneErrorResponseMiddleware(localisedErrorMessage)
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
        const middleware = getSendMissingTimeZoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `timeZone` of 'undefined' or 'null'."))
    })

})

describe('validateTimeZoneMiddleware', () => {
    const londonTimeZone = 'Europe/London'

    test('that response.locals.validTimeZone is defined when timeZone exists', () => {
        expect.assertions(3)
        const isValidTimeZone = jest.fn(() => true)

        const request: any = {
        };
        const response: any = {
            locals: { timeZone: londonTimeZone }
        };
        const next = jest.fn();

        const middleware = getValidateTimeZoneMiddleware(isValidTimeZone)
        middleware(request, response, next)

        expect(isValidTimeZone).toBeCalledWith(londonTimeZone)
        expect(response.locals.validTimeZone).toEqual(true)
        expect(next).toBeCalledWith();
    })

    test('that response.locals.validTimeZone is null if timeZone does not exist', () => {
        expect.assertions(3)
        const isValidTimeZone = jest.fn(() => null)

        const request: any = {
        };
        const response: any = {
            locals: { timeZone: londonTimeZone }
        };
        const next = jest.fn();

        const middleware = getValidateTimeZoneMiddleware(isValidTimeZone)
        middleware(request, response, next)

        expect(isValidTimeZone).toBeCalledWith(londonTimeZone)
        expect(response.locals.validTimeZone).toEqual(null)
        expect(next).toBeCalledWith();
    })

    test('that next() is called with error on error', () => {
        expect.assertions(1);
        const isValidTimeZone = jest.fn(() => null)

        const request: any = {
        };
        const response: any = {
        };
        const next = jest.fn();

        const middleware = getValidateTimeZoneMiddleware(isValidTimeZone)
        middleware(request, response, next)
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `timeZone` of 'undefined' or 'null'."))
    })
})

describe('sendInvalidTimeZoneErrorResponseMiddleware', () => {

    test('that next() is called when time zone is valid', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
        };
        const response: any = {
            status, locals: { validTimeZone: true }
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendInvalidTimeZoneErrorResponseMiddleware(localisedErrorMessage)
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
            status, locals: { validTimeZone: null }
        };
        const next = jest.fn();

        const localisedErrorMessage = 'Error'
        const middleware = getSendInvalidTimeZoneErrorResponseMiddleware(localisedErrorMessage)
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
        const middleware = getSendInvalidTimeZoneErrorResponseMiddleware(localisedErrorMessage)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `validTimeZone` of 'undefined' or 'null'."))
    })

})

describe('defineCurrentTimeMiddleware', () => {
    test('that response.locals.currentTime is defined and next is called', () => {
        expect.assertions(4)
        const timeZone = 'Europe/London'
        const tz = jest.fn(() => true)
        const moment = jest.fn(() => ({ tz }))
        const request: any = {}
        const response: any = { locals: { timeZone } }
        const next = jest.fn()
        const middleware = getDefineCurrentTimeMiddleware(moment)
        middleware(request, response, next)
        expect(moment).toBeCalledWith()
        expect(tz).toBeCalledWith(timeZone)
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

        class SoloStreak {
            userId: string;
            name: string;
            description: string;

            constructor({ userId, name, description }) {
                this.userId = userId;
                this.name = name;
                this.description = description
            }
        }

        const response: any = { locals: {} };
        const request: any = { body: { userId, name, description } };
        const next = jest.fn();

        const middleware = getCreateSoloStreakFromRequestMiddleware(SoloStreak)

        middleware(request, response, next);

        expect.assertions(2);
        const newSoloStreak = new SoloStreak({ userId, name, description })
        expect(response.locals.newSoloStreak).toEqual(newSoloStreak)
        expect(next).toBeCalledWith()
    });

    test('should call next with error message on error', () => {

        const userId = 'abcdefg';
        const name = 'streak name'
        const description = 'mock streak description'

        const response: any = { locals: {} };
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

describe('createDailySoloStreakCompleteChecker', () => {

    test('that agenda job is created successfully', async () => {
        const userId = 'abc'
        const request: any = { body: { userId } }
        const endOfDay = new Date()
        const response: any = { locals: { endOfDay } }
        const next = jest.fn()
        const start = jest.fn(() => Promise.resolve(true))
        const schedule = jest.fn(() => Promise.resolve(true))
        const processEvery = jest.fn(() => Promise.resolve(true))
        const agenda = { start, schedule, processEvery }
        const middleware = getCreateDailySoloStreakCompleteChecker(agenda)
        await middleware(request, response, next)

        expect.assertions(4)
        expect(start).toBeCalledWith()
        expect(schedule).toBeCalledWith(endOfDay, AgendaJobs.soloStreakCompleteTracker, { userId })
        expect(processEvery).toBeCalledWith(AgendaProcessTimes.oneDays)
        expect(next).toBeCalledWith()
    })

    test('that next is called with error message on failure', async () => {
        const userId = 'abc'
        const request: any = { body: { userId } }
        const endOfDay = new Date()
        const response: any = { locals: { endOfDay } }
        const next = jest.fn()
        const agenda = {}
        const middleware = getCreateDailySoloStreakCompleteChecker(agenda)
        await middleware(request, response, next)

        expect.assertions(1)
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
        expect.assertions(12);
        expect(createSoloStreakMiddlewares[0]).toBe(soloStreakRegistrationValidationMiddleware)
        expect(createSoloStreakMiddlewares[1]).toBe(retreiveTimeZoneHeaderMiddleware)
        expect(createSoloStreakMiddlewares[2]).toBe(sendMissingTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakMiddlewares[3]).toBe(validateTimeZoneMiddleware)
        expect(createSoloStreakMiddlewares[4]).toBe(sendInvalidTimeZoneErrorResponseMiddleware)
        expect(createSoloStreakMiddlewares[5]).toBe(defineCurrentTimeMiddleware)
        expect(createSoloStreakMiddlewares[6]).toBe(defineStartDayMiddleware)
        expect(createSoloStreakMiddlewares[7]).toBe(defineEndOfDayMiddleware)
        expect(createSoloStreakMiddlewares[8]).toBe(createSoloStreakFromRequestMiddleware)
        expect(createSoloStreakMiddlewares[9]).toBe(saveSoloStreakToDatabaseMiddleware)
        expect(createSoloStreakMiddlewares[10]).toBe(createDailySoloStreakCompleteChecker)
        expect(createSoloStreakMiddlewares[11]).toBe(sendFormattedSoloStreakMiddleware)
    });
});
