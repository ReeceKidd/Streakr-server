import * as Agenda from 'agenda'
import DATABASE_CONFIG from './DATABASE_CONFIG'

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

agenda.define(AgendaJobs.soloStreakCompleteTracker, (job, done) => {
    done()
})

export default agenda