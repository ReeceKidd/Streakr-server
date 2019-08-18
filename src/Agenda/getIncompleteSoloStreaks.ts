import { soloStreakModel } from "../Models/SoloStreak";
export const getIncompleteSoloStreaks = async (timezone: string) => {
  return soloStreakModel.find({
    timezone,
    completedToday: false
  });
};
