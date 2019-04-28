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
    soloStreakTracker = 'soloStreakTracker'
}

agenda.define(AgendaJobs.soloStreakTracker, (job, done) => {
    done()
})

export default agenda