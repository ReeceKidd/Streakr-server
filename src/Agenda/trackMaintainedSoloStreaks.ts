import streakoid from "../streakoid";
import { SoloStreak } from "@streakoid/streakoid-sdk/lib";
import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";

export const trackMaintainedSoloStreaks = async (
  maintainedSoloStreaks: SoloStreak[],
  currentLocalTime: string
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
