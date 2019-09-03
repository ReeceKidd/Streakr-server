import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";
import { SoloStreakActivityTypes } from "../Models/SoloStreak";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

export const resetIncompleteSoloStreaks = async (
  incompleteSoloStreaks: SoloStreak[],
  endDate: Date,
  timezone: string
) => {
  return incompleteSoloStreaks.map(async soloStreak => {
    soloStreak.currentStreak.endDate = endDate;
    const pastStreaks: any = [
      ...soloStreak.pastStreaks,
      soloStreak.currentStreak
    ];
    const updatedActivity = [
      ...soloStreak.activity,
      { type: SoloStreakActivityTypes.LostStreak, time: endDate }
    ];
    const updatedSoloStreakResponse = await streakoid.soloStreaks.update(
      soloStreak._id,
      {
        currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
        pastStreaks,
        activity: updatedActivity
      },
      timezone
    );

    await streakoid.streakTrackingEvents.create(
      StreakTrackingEventType.LostStreak,
      soloStreak._id,
      soloStreak.userId
    );

    return updatedSoloStreakResponse.data;
  });
};
