"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createSoloStreakMiddlewares_1 = require("./createSoloStreakMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
const headers_1 = require("../../Server/headers");
const agenda_1 = require("../../Agenda/agenda");
describe(`soloStreakRegistrationValidationMiddlware`, () => {
    const userId = "12345678";
    const name = "Spanish Streak";
    const description = " Do the insane amount of XP for Duolingo each day";
    test("that minimum amount of information needed for a streak passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId, name, description }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalled();
    });
    test("that solo streak can be created", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId, name, description }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalled();
    });
    test("that correct response is sent when userId is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { name, description }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("that error response is sent when userId is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId: 1234, name, description }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });
    test("that correct response is sent when name is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId, description }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("that error response is sent when name is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId, name: 1234, description }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" must be a string]'
        });
        expect(next).not.toBeCalled();
    });
    test("that correct response is sent when description is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId, name }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("that error response is sent when description is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userId, name, description: 1234 }
        };
        const response = {
            status
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" must be a string]'
        });
        expect(next).not.toBeCalled();
    });
});
describe("retreiveTimezoneHeaderMiddleware", () => {
    test("should define response.locals.timezone", () => {
        const londonTimezone = "Europe/London";
        const header = jest.fn(() => londonTimezone);
        const request = {
            headers: { [headers_1.SupportedRequestHeaders.xTimezone]: londonTimezone }, header
        };
        const response = {
            locals: {}
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.retreiveTimezoneHeaderMiddleware(request, response, next);
        expect.assertions(3);
        expect(header).toBeCalledWith(headers_1.SupportedRequestHeaders.xTimezone);
        expect(response.locals.timezone).toEqual(londonTimezone);
        expect(next).toBeCalledWith();
    });
    test("if timezone header is missing response.locals.timezone should be undefined", () => {
        const header = jest.fn();
        const request = {
            headers: {}, header
        };
        const response = {
            locals: {}
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.retreiveTimezoneHeaderMiddleware(request, response, next);
        expect.assertions(2);
        expect(response.locals.timezone).toEqual(undefined);
        expect(next).toBeCalledWith();
    });
    test("should call next with error on failure", () => {
        const request = {};
        const response = {
            locals: {}
        };
        const next = jest.fn();
        createSoloStreakMiddlewares_1.retreiveTimezoneHeaderMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("request.header is not a function"));
    });
});
describe("sendMissingTimezoneErrorResponseMiddleware", () => {
    const londonTimezone = "Europe/London";
    test("that next() is called when timezone is defined", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            status, locals: { timezone: londonTimezone }
        };
        const next = jest.fn();
        const localisedErrorMessage = "Error";
        const middleware = createSoloStreakMiddlewares_1.getSendMissingTimezoneErrorResponseMiddleware(localisedErrorMessage);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalled();
    });
    test("that error response is sent when timezone is not defined", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            status, locals: {}
        };
        const next = jest.fn();
        const localisedErrorMessage = "Error";
        const middleware = createSoloStreakMiddlewares_1.getSendMissingTimezoneErrorResponseMiddleware(localisedErrorMessage);
        middleware(request, response, next);
        expect.assertions(3);
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({ message: localisedErrorMessage });
        expect(next).not.toBeCalled();
    });
    test("that next() is called with error on error", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            status
        };
        const next = jest.fn();
        const localisedErrorMessage = "Error";
        const middleware = createSoloStreakMiddlewares_1.getSendMissingTimezoneErrorResponseMiddleware(localisedErrorMessage);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `timezone` of 'undefined' or 'null'."));
    });
});
describe("validateTimezoneMiddleware", () => {
    const londonTimezone = "Europe/London";
    test("that response.locals.validTimezone is defined when timezone exists", () => {
        expect.assertions(3);
        const isValidTimezone = jest.fn(() => true);
        const request = {};
        const response = {
            locals: { timezone: londonTimezone }
        };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getValidateTimezoneMiddleware(isValidTimezone);
        middleware(request, response, next);
        expect(isValidTimezone).toBeCalledWith(londonTimezone);
        expect(response.locals.validTimezone).toEqual(true);
        expect(next).toBeCalledWith();
    });
    test("that response.locals.validTimezone is null if timezone does not exist", () => {
        expect.assertions(3);
        const isValidTimezone = jest.fn(() => undefined);
        const request = {};
        const response = {
            locals: { timezone: londonTimezone }
        };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getValidateTimezoneMiddleware(isValidTimezone);
        middleware(request, response, next);
        expect(isValidTimezone).toBeCalledWith(londonTimezone);
        expect(response.locals.validTimezone).toEqual(undefined);
        expect(next).toBeCalledWith();
    });
    test("that next() is called with error on error", () => {
        expect.assertions(1);
        const isValidTimezone = jest.fn(() => undefined);
        const request = {};
        const response = {};
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getValidateTimezoneMiddleware(isValidTimezone);
        middleware(request, response, next);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `timezone` of 'undefined' or 'null'."));
    });
});
describe("sendInvalidTimezoneErrorResponseMiddleware", () => {
    test("that next() is called when time zone is valid", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            status, locals: { validTimezone: true }
        };
        const next = jest.fn();
        const localisedErrorMessage = "Error";
        const middleware = createSoloStreakMiddlewares_1.getSendInvalidTimezoneErrorResponseMiddleware(localisedErrorMessage);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalled();
    });
    test("that error response is sent when time zone is invalid", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            status, locals: { validTimezone: undefined }
        };
        const next = jest.fn();
        const localisedErrorMessage = "Error";
        const middleware = createSoloStreakMiddlewares_1.getSendInvalidTimezoneErrorResponseMiddleware(localisedErrorMessage);
        middleware(request, response, next);
        expect.assertions(3);
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({ message: localisedErrorMessage });
        expect(next).not.toBeCalled();
    });
    test("that next() is called with error on error", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            status
        };
        const next = jest.fn();
        const localisedErrorMessage = "Error";
        const middleware = createSoloStreakMiddlewares_1.getSendInvalidTimezoneErrorResponseMiddleware(localisedErrorMessage);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `validTimezone` of 'undefined' or 'null'."));
    });
});
describe("defineCurrentTimeMiddleware", () => {
    test("that response.locals.currentTime is defined and next is called", () => {
        expect.assertions(4);
        const timezone = "Europe/London";
        const tz = jest.fn(() => true);
        const moment = jest.fn(() => ({ tz }));
        const request = {};
        const response = { locals: { timezone } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getDefineCurrentTimeMiddleware(moment);
        middleware(request, response, next);
        expect(moment).toBeCalledWith();
        expect(tz).toBeCalledWith(timezone);
        expect(response.locals.currentTime).toBeDefined();
        expect(next).toBeCalledWith();
    });
    test("that on error next is called with error", () => {
        expect.assertions(1);
        const moment = jest.fn(() => ({}));
        const request = {};
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getDefineCurrentTimeMiddleware(moment);
        middleware(request, response, next);
        expect(next).toBeCalledWith(new TypeError("moment(...).tz is not a function"));
    });
});
describe("defineStartDayMiddleware", () => {
    test("that response.locals.startDay is defined and next() is called", () => {
        expect.assertions(3);
        const dayFormat = "DD/MM/YYYY";
        const format = jest.fn(() => true);
        const currentTime = {
            format
        };
        const request = {};
        const response = { locals: { currentTime } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getDefineStartDayMiddleware(dayFormat);
        middleware(request, response, next);
        expect(response.locals.startDay).toBeDefined();
        expect(format).toBeCalledWith(dayFormat);
        expect(next).toBeCalledWith();
    });
    test("that on error next is called with error", () => {
        expect.assertions(1);
        const dayFormat = "DD/MM/YYYY";
        const currentTime = {};
        const request = {};
        const response = { locals: { currentTime } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getDefineStartDayMiddleware(dayFormat);
        middleware(request, response, next);
        expect(next).toBeCalledWith(new TypeError("currentTime.format is not a function"));
    });
});
describe("defineEndOfDayMiddleware", () => {
    test("that response.locals.endOfDay is defined", () => {
        expect.assertions(4);
        const toDate = jest.fn(() => (new Date()));
        const endOf = jest.fn(() => ({ toDate }));
        const currentTime = {
            endOf
        };
        const request = {};
        const response = {
            locals: { currentTime }
        };
        const next = jest.fn();
        const dayTimeRange = "day";
        const middleware = createSoloStreakMiddlewares_1.getDefineEndOfDayMiddleware(dayTimeRange);
        middleware(request, response, next);
        expect(response.locals.endOfDay).toBeDefined();
        expect(endOf).toBeCalledWith(dayTimeRange);
        expect(toDate).toBeCalled();
        expect(next).toBeCalledWith();
    });
    test("that next is called with error on failure", () => {
        expect.assertions(1);
        const endOf = jest.fn(() => ({}));
        const currentTime = {
            endOf
        };
        const request = {};
        const response = {
            locals: { currentTime }
        };
        const next = jest.fn();
        const dayTimeRange = "day";
        const middleware = createSoloStreakMiddlewares_1.getDefineEndOfDayMiddleware(dayTimeRange);
        middleware(request, response, next);
        expect(next).toBeCalledWith(new TypeError("currentTime.endOf(...).toDate is not a function"));
    });
});
describe(`createSoloStreakFromRequestMiddleware`, () => {
    test("should define response.locals.newSoloStreak", () => __awaiter(this, void 0, void 0, function* () {
        const userId = "abcdefg";
        const name = "streak name";
        const description = "mock streak description";
        const timezone = "Europe/London";
        class SoloStreak {
            constructor({ userId, name, description, timezone }) {
                this.userId = userId;
                this.name = name;
                this.description = description;
                this.timezone = timezone;
            }
        }
        const response = { locals: { timezone } };
        const request = { body: { userId, name, description } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getCreateSoloStreakFromRequestMiddleware(SoloStreak);
        middleware(request, response, next);
        expect.assertions(2);
        const newSoloStreak = new SoloStreak({ userId, name, description, timezone });
        expect(response.locals.newSoloStreak).toEqual(newSoloStreak);
        expect(next).toBeCalledWith();
    }));
    test("should call next with error message on error", () => {
        const timezone = "Europe/London";
        const userId = "abcdefg";
        const name = "streak name";
        const description = "mock streak description";
        const response = { locals: { timezone } };
        const request = { body: { userId, name, description } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getCreateSoloStreakFromRequestMiddleware({});
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("soloStreak is not a constructor"));
    });
});
describe(`saveSoloStreakToDatabaseMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    test("should set response.locals.savedSoloStreak", () => __awaiter(this, void 0, void 0, function* () {
        const save = jest.fn(() => {
            return Promise.resolve(mockSoloStreak);
        });
        const mockSoloStreak = {
            userId: "abcdefg",
            email: "user@gmail.com",
            password: "password",
            save
        };
        const response = { locals: { newSoloStreak: mockSoloStreak } };
        const request = {};
        const next = jest.fn();
        yield createSoloStreakMiddlewares_1.saveSoloStreakToDatabaseMiddleware(request, response, next);
        expect.assertions(3);
        expect(save).toBeCalled();
        expect(response.locals.savedSoloStreak).toBeDefined();
        expect(next).toBeCalled();
    }));
    test("should call next() with err paramater if save call fails", () => __awaiter(this, void 0, void 0, function* () {
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const request = {};
        const response = { locals: { newSoloStreak: { save } } };
        const next = jest.fn();
        yield createSoloStreakMiddlewares_1.saveSoloStreakToDatabaseMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe("doesTimezoneAlreadyExistMiddleware", () => {
    test("that response.locals.doesTimezoneAlreadyExists is defined when timezone exists", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const timezone = "Europe/London";
        const findOne = jest.fn(() => Promise.resolve(true));
        const agendaJobModel = {
            findOne
        };
        const request = {};
        const response = { locals: { timezone } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getDoesTimezoneAlreadyExistMiddleware(agendaJobModel);
        yield middleware(request, response, next);
        expect(findOne).toBeCalledWith({ "data.timezone": timezone });
        expect(response.locals.doesTimezoneAlreadyExist).toBeDefined();
        expect(next).toBeCalledWith();
    }));
    test("that on error next is called with error", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const timezone = "Europe/London";
        const errorMessage = "error";
        const findOne = jest.fn(() => Promise.reject(errorMessage));
        const agendaJobModel = {
            findOne
        };
        const request = {};
        const response = { locals: { timezone } };
        const next = jest.fn();
        const middleware = createSoloStreakMiddlewares_1.getDoesTimezoneAlreadyExistMiddleware(agendaJobModel);
        yield middleware(request, response, next);
        expect(findOne).toBeCalledWith({ "data.timezone": timezone });
        expect(response.locals.doesTimezoneAlreadyExist).not.toBeDefined();
        expect(next).toBeCalledWith(errorMessage);
    }));
});
describe("createDailySoloStreakCompleteCheckerForTimezoneMiddleware", () => {
    test("that agenda job is created successfully when timezone does not already exist", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(5);
        const timezone = "Europe/London";
        const request = {};
        const endOfDay = new Date();
        const doesTimezoneAlreadyExist = undefined;
        const response = { locals: { endOfDay, doesTimezoneAlreadyExist, timezone } };
        const next = jest.fn();
        const start = jest.fn(() => Promise.resolve(true));
        const repeatEvery = jest.fn(() => Promise.resolve(true));
        const save = jest.fn(() => Promise.resolve(true));
        const schedule = jest.fn(() => Promise.resolve({ save, repeatEvery }));
        const agenda = { start, schedule, save };
        const soloStreakCompleteTrackerForTimezoneJobName = "soloStreakComplete";
        const middleware = createSoloStreakMiddlewares_1.getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware(agenda, soloStreakCompleteTrackerForTimezoneJobName);
        yield middleware(request, response, next);
        expect(schedule).toBeCalledWith(endOfDay, soloStreakCompleteTrackerForTimezoneJobName, { timezone });
        expect(start).toBeCalledWith();
        expect(repeatEvery).toBeCalledWith(agenda_1.AgendaProcessTimes.day);
        expect(save).toBeCalledWith();
        expect(next).toBeCalledWith();
    }));
    test("that agenda job is not created when timezone already exists", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const timezone = "Europe/London";
        const endOfDay = new Date();
        const doesTimezoneAlreadyExist = true;
        const request = {};
        const response = { locals: { endOfDay, doesTimezoneAlreadyExist, timezone } };
        const next = jest.fn();
        const agenda = {};
        const soloStreakCompleteTrackerForTimezoneJobName = "soloStreakComplete";
        const middleware = createSoloStreakMiddlewares_1.getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware(agenda, soloStreakCompleteTrackerForTimezoneJobName);
        yield middleware(request, response, next);
        expect(next).toBeCalledWith();
    }));
    test("that next is called with error message on failure", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(1);
        const request = {};
        const endOfDay = new Date();
        const response = { locals: { endOfDay } };
        const next = jest.fn();
        const agenda = {};
        const soloStreakCompleteTrackerForTimezoneJobName = "soloStreakComplete";
        const middleware = createSoloStreakMiddlewares_1.getCreateDailySoloStreakCompleteCheckerForTimezoneMiddleware(agenda, soloStreakCompleteTrackerForTimezoneJobName);
        yield middleware(request, response, next);
        expect(next).toBeCalledWith(new TypeError("agenda.start is not a function"));
    }));
});
describe(`sendFormattedSoloStreakMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    const savedSoloStreak = { userId: "abc", streakName: "Daily Spanish", streakDescription: "Practice spanish every day", startDate: new Date() };
    test("should send user in response with password undefined", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const soloStreakResponseLocals = { savedSoloStreak };
        const response = { locals: soloStreakResponseLocals, status };
        const request = {};
        const next = jest.fn();
        createSoloStreakMiddlewares_1.sendFormattedSoloStreakMiddleware(request, response, next);
        expect.assertions(4);
        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.created);
        expect(send).toBeCalledWith(savedSoloStreak);
    });
    test("should call next with an error on failure", () => {
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response = { locals: { savedSoloStreak }, status };
        const request = {};
        const next = jest.fn();
        createSoloStreakMiddlewares_1.sendFormattedSoloStreakMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe(`createSoloStreakMiddlewares`, () => {
    test("that createSoloStreak middlewares are defined in the correct order", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(14);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares.length).toEqual(13);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[0]).toBe(createSoloStreakMiddlewares_1.soloStreakRegistrationValidationMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[1]).toBe(createSoloStreakMiddlewares_1.retreiveTimezoneHeaderMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[2]).toBe(createSoloStreakMiddlewares_1.sendMissingTimezoneErrorResponseMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[3]).toBe(createSoloStreakMiddlewares_1.validateTimezoneMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[4]).toBe(createSoloStreakMiddlewares_1.sendInvalidTimezoneErrorResponseMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[5]).toBe(createSoloStreakMiddlewares_1.defineCurrentTimeMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[6]).toBe(createSoloStreakMiddlewares_1.defineStartDayMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[7]).toBe(createSoloStreakMiddlewares_1.defineEndOfDayMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[8]).toBe(createSoloStreakMiddlewares_1.createSoloStreakFromRequestMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[9]).toBe(createSoloStreakMiddlewares_1.saveSoloStreakToDatabaseMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[10]).toBe(createSoloStreakMiddlewares_1.doesTimezoneAlreadyExistMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[11]).toBe(createSoloStreakMiddlewares_1.createDailySoloStreakCompleteCheckerForTimezoneMiddleware);
        expect(createSoloStreakMiddlewares_1.createSoloStreakMiddlewares[12]).toBe(createSoloStreakMiddlewares_1.sendFormattedSoloStreakMiddleware);
    }));
});
//# sourceMappingURL=createSoloStreakMiddlewares.spec.js.map