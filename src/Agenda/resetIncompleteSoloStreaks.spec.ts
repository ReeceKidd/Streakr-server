import { SoloStreakActivityTypes } from "../Models/SoloStreak";
import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../sdk/streakoid";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

describe("resetSoloStreaksThatWereNotCompletedTodayByTimezone ", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks for multiple solo streaks", async () => {
    expect.assertions(2);
    streakoid.soloStreaks.update = jest.fn().mockResolvedValue({ data: {} });
    streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
    const _id = 1;
    const endDate = new Date();
    const timezone = "Europe/London";
    const currentStreak = {
      startDate: undefined,
      numberOfDaysInARow: 0
    };
    const userId = "5c35116059f7ba19e4e248a9";
    const incompleteSoloStreaks = [
      {
        _id,
        currentStreak,
        startDate: new Date(),
        completedToday: false,
        activity: [],
        pastStreaks: [],
        streakName: "Daily Danish",
        streakDescription: "Each day I must do Danish",
        userId,
        timezone: "Europe/London",
        createdAt: new Date(),
        updatedAt: new Date()
      } as any
    ];
    const pastStreaks = [{ ...currentStreak, endDate }];
    try {
      await resetIncompleteSoloStreaks(
        incompleteSoloStreaks,
        endDate,
        timezone
      );
      expect(streakoid.soloStreaks.update).toBeCalledWith(
        _id,
        {
          currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
          pastStreaks,
          activity: [
            { type: SoloStreakActivityTypes.LostStreak, time: endDate }
          ]
        },
        timezone
      );
      expect(streakoid.streakTrackingEvents.create).toBeCalledWith(
        StreakTrackingEventType.LostStreak,
        _id
      );
    } catch (err) {
      console.log(err);
    }
  });
});
