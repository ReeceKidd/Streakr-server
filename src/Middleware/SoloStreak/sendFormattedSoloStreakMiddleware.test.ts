import { sendFormattedSoloStreakMiddleware } from "../../Middleware/SoloStreak/sendFormattedSoloStreakMiddleware";

const ERROR_MESSAGE = "error";

describe(`sendFormattedSoloStreakMiddleware`, () => {
    test("should send user in response with password undefined", () => {

        const user = { userName: 'userName', email: 'username@gmail.com' }
        const streakName = 'streakName'
        const streakDescription = 'streakDescription'

        const savedSoloStreak = { user, streakName, streakDescription }
        const send = jest.fn()
        const response: any = { locals: { savedSoloStreak }, send };

        const request: any = {}
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect.assertions(3);
        expect(response.locals.savedUser.password).toBeUndefined()
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith({ user, streakName, streakDescription })
    });

    test("should call next with an error on failure", () => {
        const user = { userName: 'userName', email: 'username@gmail.com' }
        const streakName = 'streakName'
        const streakDescription = 'streakDescription'

        const savedSoloStreak = { user, streakName, streakDescription }
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