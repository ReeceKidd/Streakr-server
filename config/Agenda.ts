import * as Agenda from 'agenda'
import DATABASE_CONFIG from './DATABASE_CONFIG'
import { userModel } from '../src/Models/User';

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
    userModel.create([{
        userName: 'test',
        email: 'test',
        password: 'test'
    }])
    done()
})

export default agenda