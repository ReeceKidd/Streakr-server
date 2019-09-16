import { resetIncompleteSoloStreaks } from "./resetIncompleteSoloStreaks";
import streakoid from "../streakoid";
import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";
import { SoloStreak } from "@streakoid/streakoid-sdk/lib";

describe("resetIncompleteSoloStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("that incomplete solo streaks default current streak is reset and old streak is pushed to past streaks and lost streak activity is recorded", async () => {
    expect.assertions(2);
    streakoid.soloStreaks.update = jest.fn().mockResolvedValue({ data: {} });
    streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
    const _id = "1234";
    const endDate = new Date().toString();
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
        startDate: new Date().toString(),
        completedToday: false,
        activity: [],
        pastStreaks: [],
        streakName: "Daily Danish",
        streakDescription: "Each day I must do Danish",
        userId,
        timezone: "Europe/London",
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
      } as any
    ];
    const pastStreaks = [
      { numberOfDaysInARow: 0, endDate, startDate: endDate }
    ];
    await resetIncompleteSoloStreaks(incompleteSoloStreaks, endDate, timezone);

    expect(streakoid.soloStreaks.update).toBeCalledWith({
      soloStreakId: _id,
      updateData: {
        currentStreak: { startDate: "", numberOfDaysInARow: 0 },
        pastStreaks,
        activity: [{ type: StreakTrackingEventType.LostStreak, time: endDate }],
        active: false
      }
    });

    expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
      type: StreakTrackingEventType.LostStreak,
      streakId: _id,
      userId
    });
  });
});
