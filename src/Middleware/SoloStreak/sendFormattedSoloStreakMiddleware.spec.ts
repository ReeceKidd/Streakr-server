import { sendFormattedSoloStreakMiddleware } from "./sendFormattedSoloStreakMiddleware";
import { SoloStreakResponseLocals } from "Routes/SoloStreak/createSoloStreakMiddlewares";
import { userModel } from "../../Models/User";
import { soloStreakModel } from "../../Models/SoloStreak";

const ERROR_MESSAGE = "error";


const user = new userModel({ userName: 'userName', email: 'username@gmail.com' })
const streakName = 'streakName'
const streakDescription = 'streakDescription'
const savedSoloStreak = new soloStreakModel({ user, streakName, streakDescription })


describe(`sendFormattedSoloStreakMiddleware`, () => {
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