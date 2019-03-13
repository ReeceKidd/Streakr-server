import { Request, Response, NextFunction } from 'express'

import {
    createSoloStreakMiddlewares,
    soloStreakRegistrationValidationMiddleware,
    retreiveUserWhoCreatedSoloStreakMiddleware,
    getRetreiveUserWhoCreatedSoloStreakMiddleware,
    userExistsValidationMiddleware,
    getUserExistsValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    getCreateSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware,
    SoloStreakResponseLocals,
    formatResponseLocalsUserMiddleware,
} from './createSoloStreakMiddlewares'

import { userModel } from "../../Models/User";
import { soloStreakModel } from "../../Models/SoloStreak";

describe(`soloStreakRegistrationValidationMiddlware`, () => {

    const userId = '12345678'
    const streakName = 'Spanish Streak'
    const streakDescription = ' Do the insane amount of XP for Duolingo each day'

    test("that minimum amount of information needed for a strak passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName, streakDescription }
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
            body: { userId, streakName, streakDescription }
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
            body: { streakName, streakDescription }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when userId is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId: 1234, streakName, streakDescription }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

    test("that correct response is sent when streakName is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakDescription }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when streakName is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName: 1234, streakDescription }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

    test("that correct response is sent when streakDescription is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when streakDescription is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName, streakDescription: 1234 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        soloStreakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

});

describe(`retreiveUserWhoCreatedStreakMiddleware`, () => {

    const mockUserId = "abcdefghij123";
    const ERROR_MESSAGE = "error";


    test("should define response.locals.user when user is found", async () => {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        }
        const request: any = { body: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserWhoCreatedSoloStreakMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(true);
        expect(next).toBeCalled();
    });

    test("should not define response.locals.user when user doesn't exist", async () => {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        }
        const request: any = { body: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserWhoCreatedSoloStreakMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.emailExists).toBe(undefined);
        expect(next).toBeCalledWith();
    });

    test("should call next() with err paramater if database call fails", async () => {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        }
        const request: any = { body: { userId: mockUserId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getRetreiveUserWhoCreatedSoloStreakMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.emailExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
});

describe(`userExistsValidationMiddleware`, () => {
    const mockErrorMessage = 'User does not exist'

    test("check that error response is returned correctly when user wasn't found", async () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request = {};
        const response: any = {
            locals: {},
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(2);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({ message: mockErrorMessage });
    });

    test("check that next is called when user is defined on response.locals", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request = {};
        const response: any = {
            locals: { user: true },
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(3);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test("check that next is called with err on send failure", () => {
        const errorMessage = 'error'
        const send = jest.fn(() => { throw new Error(errorMessage) });
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response: any = {
            locals: { user: false },
            status
        };
        const next = jest.fn();

        const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});

describe('formatResponseLocalsUserMiddleware', () => {
    test('should make response.locals.user.password null', () => {
        expect.assertions(2)
        const user = { userName: 'userName', email: 'username@gmail.com', password: '12345678' };
        const request: any = {}
        const response: any = { locals: { user } }
        const next = jest.fn()

        formatResponseLocalsUserMiddleware(request, response, next)
        expect(response.locals.password).toBe(undefined)
        expect(next).toBeCalledWith()
    })
})

describe(`createSoloStreakFromRequestMiddleware`, () => {
    test("should define response.locals.newSoloStreak", async () => {

        const user = { userName: 'userName', email: 'username@gmail.com' };
        const streakName = 'streak name'
        const streakDescription = 'mock streak description'

        class SoloStreak {
            user: object;
            streakName: string;
            streakDescription: string;

            constructor({ user, streakName, streakDescription }) {
                this.user = user;
                this.streakName = streakName;
                this.streakDescription = streakDescription
            }
        }

        const response: any = { locals: { user } };
        const request: any = { body: { streakName, streakDescription } };
        const next = jest.fn();

        const middleware = getCreateSoloStreakFromRequestMiddleware(SoloStreak)

        middleware(request, response, next);

        expect.assertions(2);
        const newSoloStreak = new SoloStreak({ user, streakName, streakDescription })
        expect(response.locals.newSoloStreak).toEqual(newSoloStreak)
        expect(next).toBeCalledWith()
    });

    test('should call next with error message on error', () => {

        const user = { userName: 'userName', email: 'username@gmail.com' };
        const streakName = 'streak name'
        const streakDescription = 'mock streak description'

        const response: any = { locals: { user } };
        const request: any = { body: { streakName, streakDescription } };
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
            userName: 'User',
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

describe(`sendFormattedSoloStreakMiddleware`, () => {
    const ERROR_MESSAGE = "error";


    const user = new userModel({ userName: 'userName', email: 'username@gmail.com' })
    const streakName = 'streakName'
    const streakDescription = 'streakDescription'
    const savedSoloStreak = new soloStreakModel({ user, streakName, streakDescription })
    test("should send user in response with password undefined", () => {

        const send = jest.fn()
        const soloStreakResponseLocals: SoloStreakResponseLocals = { savedSoloStreak }
        const response: any = { locals: soloStreakResponseLocals, send };

        const request: any = {}
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect.assertions(3);
        expect(response.locals.user).toBeUndefined()
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith(savedSoloStreak)
    });

    test("should call next with an error on failure", () => {

        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const response: any = { locals: { savedSoloStreak }, send };

        const request: any = {}
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })


});

describe(`createSoloStreakMiddlewares`, () => {
    test("that createSoloStreak middlewares are defined in the correct order", async () => {
        expect.assertions(7);
        expect(createSoloStreakMiddlewares[0]).toBe(soloStreakRegistrationValidationMiddleware)
        expect(createSoloStreakMiddlewares[1]).toBe(retreiveUserWhoCreatedSoloStreakMiddleware)
        expect(createSoloStreakMiddlewares[2]).toBe(userExistsValidationMiddleware)
        expect(createSoloStreakMiddlewares[3]).toBe(formatResponseLocalsUserMiddleware)
        expect(createSoloStreakMiddlewares[4]).toBe(createSoloStreakFromRequestMiddleware)
        expect(createSoloStreakMiddlewares[5]).toBe(saveSoloStreakToDatabaseMiddleware)
        expect(createSoloStreakMiddlewares[6]).toBe(sendFormattedSoloStreakMiddleware)
    });
});
