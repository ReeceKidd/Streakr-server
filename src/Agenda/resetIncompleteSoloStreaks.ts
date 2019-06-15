import * as mongoose from "mongoose";
import { SoloStreak } from "../Models/SoloStreak";


export const resetIncompleteSoloStreaks = async (soloStreakModel: mongoose.Model<SoloStreak>, incompleteSoloStreaks: SoloStreak[], defaultCurrentStreak: { numberOfDaysInARow: number }, endDate: Date) => {
    return incompleteSoloStreaks.map(async soloStreak => {
        soloStreak.currentStreak.endDate = endDate;
        const pastStreak = soloStreak.currentStreak;
        return soloStreakModel.findByIdAndUpdate(soloStreak._id,
            {
                currentStreak: defaultCurrentStreak,
                $push: { pastStreaks: pastStreak }
            });
    });
};