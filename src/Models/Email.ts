import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { Email } from '@streakoid/streakoid-models/lib';

export type EmailModel = Email & mongoose.Document;

export const emailSchema = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
        },
        subject: {
            required: true,
            type: String,
        },
        message: {
            required: true,
            type: String,
        },
        userId: {
            type: String,
        },
        username: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: Collections.Emails,
    },
);

export const emailModel: mongoose.Model<EmailModel> = mongoose.model<EmailModel>(Models.Email, emailSchema);
