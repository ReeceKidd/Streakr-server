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
    }
})

export enum AgendaJobs {
    soloStreakCompleteTracker = 'soloStreakCompleteTracker'
}

export enum AgendaProcessTimes {
    oneDays = '1 days'
}

export enum AgendaTimeRanges {
    day = 'day'
}

agenda.define(AgendaJobs.soloStreakCompleteTracker, async (job, done) => {
    const { userId } = job.attrs.data
    const soloStreak = await soloStreakModel.findOne({ userId })
    // I need to check if the calendar has been maintained for that day. 
    // This means I need a new Rest resource to say that a user has completed
    // their task for the day. Maybe task will be the name of the resource. 
    // and it will take the name of the streak. Or is it simply that the user
    // has to update the soloStreakActivity? Might need to ask Bruno. 

    // If the user has not updated their streak that day it should be moved into 
    // their past streaks on the UserModel. Don't delete the streak but do delete the 
    // agenda job that checks it each day. 
    done()
})

export default agenda