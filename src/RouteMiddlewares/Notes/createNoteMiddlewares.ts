import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const createNoteBodyValidationSchema = {
    userId: Joi.string().required(),
    streakId: Joi.string().required(),
    note: Joi.string().required(),
};

export const createNoteBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        createNoteBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateNoteFromRequestMiddleware = (noteModel: mongoose.Model<NoteModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, streakId, note } = request.body;
        const newNote = new noteModel({
            userId,
            streakId,
            note,
        });
        response.locals.savedNote = await newNote.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateNoteFromRequestMiddleware, err));
    }
};

export const createNoteFromRequestMiddleware = getCreateNoteFromRequestMiddleware(noteModel);

export const sendFormattedNoteMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedNote } = response.locals;
        response.status(ResponseCodes.created).send(savedNote);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedNoteMiddleware, err));
    }
};

export const createNoteMiddlewares = [
    createNoteBodyValidationMiddleware,
    createNoteFromRequestMiddleware,
    sendFormattedNoteMiddleware,
];
