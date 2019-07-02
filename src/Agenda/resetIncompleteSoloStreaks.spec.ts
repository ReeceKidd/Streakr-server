import { soloStreakModel } from "../Models/SoloStreak";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";

describe("resetSoloStreaksThatWereNotCompletedTodayByTimezone ", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for multiple solo streaks", async () => {
    expect.assertions(2);
    soloStreakModel.findByIdAndUpdate = jest.fn();
    const _id = 1;
    const endDate = new Date();
    const incompleteSoloStreaks = [
      {
        _id,
        currentStreak: {
          startDate: undefined,
          endDate,
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
        updatedAt: new Date()
      } as any
    ];
    await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate);
    expect(soloStreakModel.findByIdAndUpdate).toBeCalledTimes(
      incompleteSoloStreaks.length
    );
    expect(soloStreakModel.findByIdAndUpdate).toBeCalledWith(_id, {
      currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
      $push: { pastStreaks: { ...incompleteSoloStreaks[0].currentStreak } }
    });
  });
});
