export const manageSoloStreaksForTimezone = async (timezone: string, soloStreakModel, defaultCurrentStreak, endDate: Date) => {
    const soloStreaksToBeUpdated = await soloStreakModel.find({ timezone, completedToday: false }).lean()
    await Promise.all(soloStreaksToBeUpdated.map(soloStreak => {
        const endedStreak = {
            ...soloStreak.currentStreak,
            endDate
        }
        return soloStreakModel.findByIdAndUpdate(soloStreak._id,
            {
                currentStreak: defaultCurrentStreak,
                $push: { pastStreaks: endedStreak }
            })
    }))
}