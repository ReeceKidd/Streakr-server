import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import * as mongoose from "mongoose";
import { SoloStreak } from "../Models/SoloStreak";
import { soloStreakId } from "../Routers/soloStreaksRouter";

describe("resetSoloStreaksThatWereNotCompletedTodayByTimezone ", () => {

    const defaultCurrentStreak = {
        startDate: undefined,
        numberOfDaysInARow: 0
    };
    const endDate = new Date();

    test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for multiple solo streaks", async () => {
        expect.assertions(2);
        const _id = 1;
        const incompleteSoloStreaks = [
            {
                _id,
                currentStreak: {
                    startDate: undefined,
                    numberOfDaysInARow: 0
                },
                startDate: new Date(),
                completedToday: false,
                pastStreaks: [],
                streakName: "Daily Danish",
                streakDescription: "Each day I must do Danish",
                userId: "5c35116059f7ba19e4e248a9",
                timezone: "Europe/London",
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any
        ];

        const endedStreak = {
            startDate: undefined,
            numberOfDaysInARow: 0, endDate
        };
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
        } as any;
        soloStreakModel.findByIdAndUpdate = findByIdAndUpdate;
        await resetIncompleteSoloStreaks(soloStreakModel, incompleteSoloStreaks, defaultCurrentStreak, endDate);
        expect(findByIdAndUpdate).toBeCalledTimes(incompleteSoloStreaks.length);
        expect(findByIdAndUpdate).toBeCalledWith(_id,
            {
                currentStreak: defaultCurrentStreak,
                $push: { pastStreaks: endedStreak }
            });
    });
});