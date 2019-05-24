import * as Agenda from 'agenda'
import DATABASE_CONFIG from '../../config/DATABASE_CONFIG'
import { soloStreakModel } from '../Models/SoloStreak'
import { manageSoloStreaksForTimezone } from './soloStreakCompleteForTimezoneTracker';

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
    soloStreakCompleteForTimezoneTracker = 'soloStreakCompleteForTimezoneTracker'
}

export enum AgendaProcessTimes {
    day = '24 hours'
}

export enum AgendaTimeRanges {
    day = 'day'
}

agenda.define(AgendaJobs.soloStreakCompleteForTimezoneTracker, async (job, done) => {
    const { timeZone } = job.attrs.data
    await manageSoloStreaksForTimezone(timeZone, soloStreakModel)
    done()
})

export default agenda