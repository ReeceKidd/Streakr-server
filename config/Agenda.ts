import * as Agenda from 'agenda'
import DATABASE_CONFIG from './DATABASE_CONFIG'
import { soloStreakModel } from '../src/Models/SoloStreak';
import * as moment from 'moment-timezone'

const databseURL = DATABASE_CONFIG[process.env.NODE_ENV]

const agenda = new Agenda({
    db: {
        address: databseURL,
        collection: 'AgendaJobs',
        options: {
            useNewUrlParser: true
        }
    },
    processEvery: '30 seconds'
})

export enum AgendaJobs {
    soloStreakCompleteTrackerForTimezone = 'soloStreakCompleteTrackerForTimezone'
}

export enum AgendaProcessTimes {
    day = '24 hours'
}

export enum AgendaTimeRanges {
    day = 'day'
}

agenda.define(AgendaJobs.soloStreakCompleteTrackerForTimezone, async (job, done) => {
    const { timeZone } = job.attrs.data
    const defaultCurrentStreak = {
        startDate: new Date(),
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
                currentStreak: defaultCurrentStreak,
                $push: { pastStreaks: endedStreak }
            })
    }))
    done()
})

export default agenda