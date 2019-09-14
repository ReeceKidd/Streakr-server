import { SoloStreak } from "../Models/SoloStreak";

import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";
import streakoid from "../streakoid";

export const resetIncompleteSoloStreaks = async (
  incompleteSoloStreaks: SoloStreak[],
  endDate: Date,
  timezone: string
) => {
  return Promise.all(
    incompleteSoloStreaks.map(async soloStreak => {
      soloStreak.currentStreak.endDate = endDate;
      const pastStreaks: any = [
        ...soloStreak.pastStreaks,
        soloStreak.currentStreak
      ];
      const updatedActivity = [
        ...soloStreak.activity,
        { type: StreakTrackingEventType.LostStreak, time: endDate }
      ];
      await streakoid.soloStreaks.update({
        soloStreakId: soloStreak._id,
        timezone,
        updateData: {
          currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
          pastStreaks,
          activity: updatedActivity,
          active: false
        }
      });

      return streakoid.streakTrackingEvents.create({
        type: StreakTrackingEventType.LostStreak,
        streakId: soloStreak._id,
        userId: soloStreak.userId
      });
    })
  );
};
