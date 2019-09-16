import { trackInactiveSoloStreaks } from "./trackInactiveSoloStreaks";
import streakoid from "../streakoid";
import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";

describe("trackInactiveSoloStreaks", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("that inactive solo streak activity gets updated and a solo streak tracking event is created", async () => {
    expect.assertions(2);
    streakoid.soloStreaks.update = jest.fn().mockResolvedValue({ data: {} });
    streakoid.streakTrackingEvents.create = jest.fn().mockResolvedValue(true);
    const _id = 1;
    const currentLocalTime = new Date().toString();
    const timezone = "Europe/London";
    const currentStreak = {
      startDate: new Date(),
      numberOfDaysInARow: 1
    };
    const userId = "5c35116059f7ba19e4e248a9";
    const inactiveSoloStreaks = [
      {
        _id,
        currentStreak,
        startDate: new Date(),
        completedToday: true,
        active: false,
        activity: [],
        pastStreaks: [],
        streakName: "Daily Danish",
        streakDescription: "Each day I must do Danish",
        userId,
        timezone,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any
    ];
    await trackInactiveSoloStreaks(inactiveSoloStreaks, currentLocalTime);
    expect(streakoid.soloStreaks.update).toBeCalledWith({
      soloStreakId: _id,
      timezone,
      updateData: {
        activity: [
          {
            type: StreakTrackingEventType.InactiveStreak,
            time: currentLocalTime
          }
        ]
      }
    });
    expect(streakoid.streakTrackingEvents.create).toBeCalledWith({
      type: StreakTrackingEventType.InactiveStreak,
      streakId: _id,
      userId
    });
  });
});
