import * as mongoose from 'mongoose';
import { Collections } from './Collections';
import { Models } from './Models';
import { Note } from '@streakoid/streakoid-models/lib';

export type NoteModel = Note & mongoose.Document;

export const noteSchema = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: String,
            index: true,
        },
        subjectId: {
            required: true,
            type: String,
            index: true,
        },
        text: {
            required: true,
            type: String,
            index: true,
        },
    },
    {
        timestamps: true,
        collection: Collections.Notes,
    },
);

export const noteModel: mongoose.Model<NoteModel> = mongoose.model<NoteModel>(Models.Note, noteSchema);
