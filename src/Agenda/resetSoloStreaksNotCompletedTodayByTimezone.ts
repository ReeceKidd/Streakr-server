import * as mongoose from "mongoose";
import { SoloStreak } from "../Models/SoloStreak";

export const resetSoloStreaksNotCompletedTodayByTimezone = async (soloStreakModel: mongoose.Model<SoloStreak>, getIncompleteSoloStreaks, resetIncompleteSoloStreaks, timezone: string, defaultCurrentStreak: { startDate: Date, numberOfDaysInARow: number }, endDate: Date) => {
    const incompleteSoloStreaks = await getIncompleteSoloStreaks(soloStreakModel, timezone);
    return resetIncompleteSoloStreaks(soloStreakModel, incompleteSoloStreaks, defaultCurrentStreak, endDate);
};
