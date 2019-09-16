import streakoid from "../streakoid";
import {
  SoloStreak,
  CurrentStreak,
  Activtiy,
  PastStreakArray,
  PastStreak
} from "@streakoid/streakoid-sdk/lib";
import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";

export const resetIncompleteSoloStreaks = async (
  incompleteSoloStreaks: SoloStreak[],
  endDate: string,
  timezone: string
) => {
  return Promise.all(
    incompleteSoloStreaks.map(async soloStreak => {
      const pastStreak: PastStreak = {
        endDate: endDate,
        startDate: soloStreak.currentStreak.startDate || endDate,
        numberOfDaysInARow: soloStreak.currentStreak.numberOfDaysInARow
      };

      const pastStreaks: PastStreakArray = [
        ...soloStreak.pastStreaks,
        pastStreak
      ];

      const activity: Activtiy = {
        type: StreakTrackingEventType.LostStreak,
        time: endDate.toString()
      };
      const updatedActivity = [...soloStreak.activity, activity];

      const currentStreak: CurrentStreak = {
        startDate: "",
        numberOfDaysInARow: 0
      };

      await streakoid.soloStreaks.update({
        soloStreakId: soloStreak._id,
        updateData: {
          currentStreak,
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
