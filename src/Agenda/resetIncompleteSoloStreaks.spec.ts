import { soloStreakModel } from "../Models/SoloStreak";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";

describe("resetSoloStreaksThatWereNotCompletedTodayByTimezone ", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for multiple solo streaks", async () => {
    expect.assertions(1);
    streakoid.soloStreaks.update = jest.fn().mockResolvedValue({ data: {} });
    const _id = 1;
    const endDate = new Date();
    const timezone = "Europe/London";
    const currentStreak = {
      startDate: undefined,
      numberOfDaysInARow: 0
    };
    const incompleteSoloStreaks = [
      {
        _id,
        currentStreak,
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
    const pastStreaks = [{ ...currentStreak, endDate }];
    await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate, timezone);
    expect(streakoid.soloStreaks.update).toBeCalledWith(
      _id,
      {
        currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
        pastStreaks
      },
      timezone
    );
  });
});
