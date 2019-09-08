import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

export const trackMaintainedSoloStreaks = async (
  maintainedSoloStreaks: SoloStreak[],
  currentLocalTime: Date
) => {
  return Promise.all(
    maintainedSoloStreaks.map(async soloStreak => {
      const timezone = soloStreak.timezone;

      const updatedActivity = [
        ...soloStreak.activity,
        {
          type: StreakTrackingEventType.MaintainedStreak,
          time: currentLocalTime
        }
      ];

      await streakoid.soloStreaks.update(soloStreak._id, timezone, {
        activity: updatedActivity,
        completedToday: false
      });

      return streakoid.streakTrackingEvents.create(
        StreakTrackingEventType.MaintainedStreak,
        soloStreak._id,
        soloStreak.userId
      );
    })
  );
};
