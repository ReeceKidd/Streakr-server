import { resetSoloStreaksThatWereNotCompletedTodayByTimezone } from "./resetSoloStreaksThatWereNotCompletedTodayByTimezone";

describe("resetSoloStreaksThatWereNotCompletedTodayByTimezone ", () => {

    const defaultCurrentStreak = {
        startDate: undefined,
        numberOfDaysInARow: 0
    };
    const endDate = new Date();

    test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for multiple solo streaks", async () => {
        expect.assertions(3);
        const timezone = "Europe/London";
        const soloStreaks = [
            {
                _id: 1,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                name: "Daily Danish",
                description: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                _id: 2,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                name: "Daily Danish",
                description: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const lean = jest.fn(() => (Promise.resolve(soloStreaks)));
        const find = jest.fn(() => ({ lean }));
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
            findByIdAndUpdate
        };
        await resetSoloStreaksThatWereNotCompletedTodayByTimezone(timezone, soloStreakModel, defaultCurrentStreak, endDate);
        expect(find).toBeCalledWith({ timezone, completedToday: false });
        expect(lean).toBeCalledWith();
        expect(findByIdAndUpdate).toBeCalledTimes(soloStreaks.length);
    });


    test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for single streaks", async () => {
        expect.assertions(3);
        const timezone = "Europe/London";
        const soloStreaks = [
            {
                _id: 1,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                name: "Daily Danish",
                description: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];
        const lean = jest.fn(() => (Promise.resolve(soloStreaks)));
        const find = jest.fn(() => ({ lean }));
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
            findByIdAndUpdate
        };
        await resetSoloStreaksThatWereNotCompletedTodayByTimezone(timezone, soloStreakModel, defaultCurrentStreak, endDate);
        expect(find).toBeCalledWith({ timezone, completedToday: false });
        expect(lean).toBeCalledWith();
        expect(findByIdAndUpdate).toBeCalledWith(soloStreaks[0]._id, { currentStreak: defaultCurrentStreak, $push: { pastStreaks: { ...soloStreaks[0].currentStreak, endDate } } });
    });
});