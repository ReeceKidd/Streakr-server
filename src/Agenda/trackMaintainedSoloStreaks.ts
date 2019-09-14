import { SoloStreak } from "../Models/SoloStreak";

import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";
import streakoid from "../streakoid";

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

      await streakoid.soloStreaks.update({
        soloStreakId: soloStreak._id,
        timezone,
        updateData: {
          activity: updatedActivity,
          completedToday: false
        }
      });

      return streakoid.streakTrackingEvents.create({
        type: StreakTrackingEventType.MaintainedStreak,
        streakId: soloStreak._id,
        userId: soloStreak.userId
      });
    })
  );
};
