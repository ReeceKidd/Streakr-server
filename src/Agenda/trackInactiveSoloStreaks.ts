import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

export const trackInactiveSoloStreaks = async (
  maintainedSoloStreaks: SoloStreak[],
  currentLocalTime: Date
) => {
  return Promise.all(
    maintainedSoloStreaks.map(async soloStreak => {
      const timezone = soloStreak.timezone;

      const updatedActivity = [
        ...soloStreak.activity,
        {
          type: StreakTrackingEventType.InactiveStreak,
          time: currentLocalTime
        }
      ];

      await streakoid.soloStreaks.update(soloStreak._id, timezone, {
        activity: updatedActivity
      });

      return streakoid.streakTrackingEvents.create(
        StreakTrackingEventType.InactiveStreak,
        soloStreak._id,
        soloStreak.userId
      );
    })
  );
};
