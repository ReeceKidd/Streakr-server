import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";

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
    const updatedSoloStreakResponse = await streakoid.soloStreaks.update(
      soloStreak._id,
      {
        currentStreak: { startDate: undefined, numberOfDaysInARow: 0 },
        pastStreaks
      },
      timezone
    );
    return updatedSoloStreakResponse.data;
  });
};
