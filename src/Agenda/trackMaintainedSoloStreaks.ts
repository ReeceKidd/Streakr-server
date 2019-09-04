import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";
import { SoloStreakActivityTypes } from "../Models/SoloStreak";
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
          type: SoloStreakActivityTypes.MaintainedStreak,
          time: currentLocalTime
        }
      ];

      await streakoid.soloStreaks.update(soloStreak._id, timezone, {
        activity: updatedActivity
      });

      return streakoid.streakTrackingEvents.create(
        StreakTrackingEventType.MaintainedStreak,
        soloStreak._id,
        soloStreak.userId
      );
    })
  );
};
