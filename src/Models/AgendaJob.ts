import * as mongoose from 'mongoose'
import { Models } from './Models';
import { AgendaJobs } from '../../config/Agenda';

export interface IAgendaJob extends mongoose.Document {
    _id: string;
    name: AgendaJobs;
    data: object;
    type: string;
    nextRunAt: Date,
    lastModifiedBy: string,
    lockedAt: string,
    lastFinishedAt: Date
}

export const agendaJobSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        data: {},
        type: {
            type: String,
        },
        nextRunAt: {
            type: Date,
            default: Date.now,
            index: true
        },
        lastModifiedBy: {
            type: String,
        },
        lockedAt: {
            type: Date,
            index: true
        },
        lastFinishedAt: Date
    });

export const agendaJobModel: mongoose.Model<IAgendaJob> = mongoose.model<IAgendaJob>(Models.AgendaJob, agendaJobSchema);