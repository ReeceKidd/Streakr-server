import { saveSoloStreakToDatabaseMiddleware } from "../../Middleware/Database/saveSoloStreakToDatabaseMiddleware";

const ERROR_MESSAGE = "error";

describe(`saveSoloStreakToDatabaseMiddleware`, () => {

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
