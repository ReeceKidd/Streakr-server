import * as Agenda from 'agenda'
import DATABASE_CONFIG from './DATABASE_CONFIG'
import { soloStreakModel } from '../src/Models/SoloStreak';

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
    console.log('ENTERED')
    const { timeZone } = job.attrs.data
    const defaultCurrentStreak = {
        startDate: null,
        numberOfDaysInARow: 0,
        endDate: null
    }
    const soloStreaksToBeUpdated = await soloStreakModel.find({ timeZone, completedToday: false })
    soloStreaksToBeUpdated.forEach(async soloStreak => {
        await soloStreakModel.findOneAndUpdate({ _id: soloStreak._id },
            {
                currentStreak: defaultCurrentStreak,
                $push: { pastStreaks: soloStreak.currentStreak }
            })
    })
    console.log('SUCCESS')
    // NEED TO FIND A WAY TO MAKE SURE AGENDA RUNS AT THE SAME TIME EVERY DAY
    done()
})

export default agenda