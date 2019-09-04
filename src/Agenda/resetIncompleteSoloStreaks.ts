import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";
import { SoloStreakActivityTypes } from "../Models/SoloStreak";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

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
        { type: SoloStreakActivityTypes.LostStreak, time: endDate }
      ];
      await streakoid.soloStreaks.update(soloStreak._id, timezone, {
        currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
        pastStreaks,
        activity: updatedActivity
      });

      return streakoid.streakTrackingEvents.create(
        StreakTrackingEventType.LostStreak,
        soloStreak._id,
        soloStreak.userId
      );
    })
  );
};
