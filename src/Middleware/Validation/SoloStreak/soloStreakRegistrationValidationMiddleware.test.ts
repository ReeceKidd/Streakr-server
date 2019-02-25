import { soloStreakRegistrationValidationMiddleware } from "../../../Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware";

const userId = '12345678'
const streakName = 'Spanish Streak'
const streakDescription = ' Do the insane amount of XP for Duolingo each day'

describe(`soloStreakRegistrationValidationMiddlware`, () => {
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
