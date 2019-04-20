import {
    createSoloStreakMiddlewares,
    soloStreakRegistrationValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    getCreateSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware,
    SoloStreakResponseLocals,
} from './createSoloStreakMiddlewares'

import { userModel } from "../../Models/User";
import { soloStreakModel } from "../../Models/SoloStreak";

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
            body: { userId: 1234, name, description }
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
        expect(status).toHaveBeenCalledWith(422);
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
        expect(status).toHaveBeenCalledWith(422);
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
        expect(status).toHaveBeenCalledWith(422);
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
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

});

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

describe(`sendFormattedSoloStreakMiddleware`, () => {
    const ERROR_MESSAGE = "error";


    const user = new userModel({ userName: 'userName', email: 'username@gmail.com' })
    const name = 'name'
    const description = 'description'
    const savedSoloStreak = new soloStreakModel({ user, name, description })
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
        expect.assertions(4);
        expect(createSoloStreakMiddlewares[0]).toBe(soloStreakRegistrationValidationMiddleware)
        expect(createSoloStreakMiddlewares[1]).toBe(createSoloStreakFromRequestMiddleware)
        expect(createSoloStreakMiddlewares[2]).toBe(saveSoloStreakToDatabaseMiddleware)
        expect(createSoloStreakMiddlewares[3]).toBe(sendFormattedSoloStreakMiddleware)
    });
});
