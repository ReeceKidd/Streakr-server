import { getCreateSoloStreakFromRequestMiddleware } from "../../Middleware/SoloStreak/createSoloStreakFromRequestMiddleware";

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