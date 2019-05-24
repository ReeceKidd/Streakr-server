export const manageSoloStreaksForTimezone = async (timeZone: string, soloStreakModel) => {
    const defaultCurrentStreak = {
        startDate: null,
        numberOfDaysInARow: 0,
        endDate: null
    }
    const soloStreaksToBeUpdated = await soloStreakModel.find({ timeZone, completedToday: false }).lean()
    await Promise.all(soloStreaksToBeUpdated.map(soloStreak => {
        const endDate = new Date()
        const endedStreak = {
            ...soloStreak.currentStreak,
            endDate
        }
        return soloStreakModel.findByIdAndUpdate(soloStreak._id,
            {
                "currentStreak": defaultCurrentStreak,
                $push: { pastStreaks: endedStreak }
            })
    }))
}