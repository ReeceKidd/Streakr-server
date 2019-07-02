import { soloStreakModel } from "../Models/SoloStreak";
export const getIncompleteSoloStreaks = (timezone: string) => {
  return soloStreakModel.find({
    timezone,
    completedToday: false,
    "currentStreak.startDate": { $exists: true }
  });
};
