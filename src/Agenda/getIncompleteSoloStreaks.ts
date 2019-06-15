export const getIncompleteSoloStreaks = (soloStreakModel, timezone) => {
    return soloStreakModel.find({ timezone, completedToday: false, startDate: { $exists: true } });
};