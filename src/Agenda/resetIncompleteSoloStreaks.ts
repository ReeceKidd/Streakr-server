import * as mongoose from "mongoose";
import { SoloStreak, soloStreakModel } from "../Models/SoloStreak";

export const resetIncompleteSoloStreaks = async (
  incompleteSoloStreaks: SoloStreak[],
  endDate: Date
) => {
  const defaultCurrentStreak = {
    startDate: undefined,
    numberOfDaysInARow: 0
  };
  return incompleteSoloStreaks.map(async soloStreak => {
    soloStreak.currentStreak.endDate = endDate;
    const pastStreak = soloStreak.currentStreak;
    return soloStreakModel.findByIdAndUpdate(soloStreak._id, {
      currentStreak: defaultCurrentStreak,
      $push: { pastStreaks: pastStreak }
    });
  });
};
