import { SoloStreak } from "../Models/SoloStreak";

import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";
import streakoid from "../streakoid";

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

      await streakoid.soloStreaks.update({
        soloStreakId: soloStreak._id,
        timezone,
        updateData: {
          activity: updatedActivity
        }
      });

      return streakoid.streakTrackingEvents.create({
        type: StreakTrackingEventType.InactiveStreak,
        streakId: soloStreak._id,
        userId: soloStreak.userId
      });
    })
  );
};
