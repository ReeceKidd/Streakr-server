import { SoloStreak } from "../Models/SoloStreak";
import streakoid from "../sdk/streakoid";

export const resetIncompleteSoloStreaks = async (
  incompleteSoloStreaks: SoloStreak[],
  endDate: Date,
  timezone: string
) => {
  const defaultCurrentStreak = {
    startDate: undefined,
    numberOfDaysInARow: 0
  };
  return incompleteSoloStreaks.map(async soloStreak => {
    soloStreak.currentStreak.endDate = endDate;
    const pastStreaks: any = [
      ...soloStreak.pastStreaks,
      soloStreak.currentStreak
    ];
    const updatedSoloStreakResponse = await streakoid.soloStreaks.update(
      soloStreak._id,
      { currentStreak: defaultCurrentStreak, pastStreaks },
      timezone
    );
    return updatedSoloStreakResponse.data;
  });
};
