import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const StreakSchema =  new Schema(
    {
        streakName: {
            required: true,
            type: String,
            // Short term solution until I get tests passing. 
            index: true
        },
        description: {
            required: true,
            type: String,
        },
        createdBy: {
            required: true,
            type: String
        },
        participants: {
            required: true, 
            type: Array
        },
        startDate: {
            type: Date,
            default: new Date()
        },
        calendar: {
            type: Array,
            default: []
        },
        successCriteria: { 
            type: String
        },
        duration: {
            type: String
        },
        endDate:{
            type: Date
        },
        lastManStanding: {
            type: Boolean
        },
    },
    {
      collection: 'Streaks'
    }   
    )

    export default mongoose.model('Streak', StreakSchema)