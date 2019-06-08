export const resetSoloStreaksThatWereNotCompletedTodayByTimezone = async (timezone: string, soloStreakModel, defaultCurrentStreak: { numberOfDaysInARow: number }, endDate: Date) => {
    const soloStreaksToBeUpdated = await soloStreakModel.find({ timezone, completedToday: false }).lean();
    return Promise.all(soloStreaksToBeUpdated.map(soloStreak => {
        const endedStreak = {
            ...soloStreak.currentStreak,
            endDate
        };
        return soloStreakModel.findByIdAndUpdate(soloStreak._id,
            {
                currentStreak: defaultCurrentStreak,
                $push: { pastStreaks: endedStreak }
            }, { new: true });
    }));
};