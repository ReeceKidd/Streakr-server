import * as mongoose from "mongoose";
import { SoloStreak } from "../Models/SoloStreak";
export const getIncompleteSoloStreaks = (soloStreakModel: mongoose.Model<SoloStreak>, timezone: string) => {
    return soloStreakModel.find({ timezone, completedToday: false, startDate: { $exists: true } });
};