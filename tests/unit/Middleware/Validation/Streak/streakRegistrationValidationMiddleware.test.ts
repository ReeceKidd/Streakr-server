import { streakRegistrationValidationMiddleware } from "../../../../../src/Middleware/Validation/Streak/streakRegistrationValidationMiddleware";

const userId = '12345678'
const streakName = 'Spanish Streak'
const streakDescription = ' Do the insane amount of XP for Duolingo each day'
const whoIsInvolved = 'Just me'
const soloForfeitDescription = 'I must give my friend £100'
const soloRewardDescription = 'I can book a trip to barcelona'
const groupForfeitDescription = 'Loser has to do something'
const groupRewardDescription = 'Winner takes home the pot.'

describe(`streakRegistrationValidationMiddlware`, () => {
    test("that minimum amount of information needed for a strak passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName, streakDescription, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    });

    test('that solo streak can be created', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName, streakDescription, whoIsInvolved, soloForfeitDescription, soloRewardDescription }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    })

    test("that correct response is sent when userId is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { streakName, streakDescription, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

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
            body: { userId: 1234, streakName, streakDescription, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

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
            body: { userId, streakDescription, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

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
            body: { userId, streakName: 1234, streakDescription, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

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
            body: { userId, streakName, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

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
            body: { userId, streakName, streakDescription: 1234, whoIsInvolved }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

    test("that correct response is sent when whoIsInvolved is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName, streakDescription }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "whoIsInvolved" fails because ["whoIsInvolved" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when whoIsInvolved is not a string", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userId, streakName, streakDescription, whoIsInvolved: 1 }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        streakRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "whoIsInvolved" fails because ["whoIsInvolved" must be a string]'
        });
        expect(next).not.toBeCalled();
    });

    test("that error response is sent when whoIsInvolved is not a supported value", () => {
        expect(true).toEqual(false)
    })

});
