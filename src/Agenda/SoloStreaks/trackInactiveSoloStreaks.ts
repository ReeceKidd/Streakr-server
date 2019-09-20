import streakoid from "../../streakoid";
import { SoloStreak, ActivityArray } from "@streakoid/streakoid-sdk/lib";
import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";
import Activity from "@streakoid/streakoid-sdk/lib/models/Activity";

export const trackInactiveSoloStreaks = async (
  maintainedSoloStreaks: SoloStreak[],
  currentLocalTime: string
) => {
  return Promise.all(
    maintainedSoloStreaks.map(async soloStreak => {
      const activity: Activity = {
        type: StreakTrackingEventType.InactiveStreak,
        time: currentLocalTime
      };

      const updatedActivity: ActivityArray = [...soloStreak.activity, activity];

      await streakoid.soloStreaks.update({
        soloStreakId: soloStreak._id,
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
