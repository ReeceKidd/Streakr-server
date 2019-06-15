export const resetSoloStreaksNotCompletedTodayByTimezone = async (soloStreakModel, getIncompleteSoloStreaks, resetIncompleteSoloStreaks, timezone, defaultCurrentStreak, endDate) => {
    const incompleteSoloStreaks = await getIncompleteSoloStreaks(soloStreakModel, timezone);
    return resetIncompleteSoloStreaks(soloStreakModel, incompleteSoloStreaks, defaultCurrentStreak, endDate);
};
