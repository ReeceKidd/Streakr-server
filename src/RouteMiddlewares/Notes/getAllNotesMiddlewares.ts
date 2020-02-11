import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getNotesQueryValidationSchema = {
    userId: Joi.string(),
    subjectId: Joi.string(),
};

export const getNotesQueryValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.query,
        getNotesQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindNotesMiddleware = (noteModel: mongoose.Model<NoteModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, subjectId } = request.query;

        const query: {
            userId?: string;
            subjectId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (subjectId) {
            query.subjectId = subjectId;
        }

        response.locals.notes = await noteModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindNotesMiddleware, err));
    }
};

export const findNotesMiddleware = getFindNotesMiddleware(noteModel);

export const sendNotesMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { notes } = response.locals;
        response.status(ResponseCodes.success).send(notes);
    } catch (err) {
        next(new CustomError(ErrorType.SendNotesMiddleware, err));
    }
};

export const getAllNotesMiddlewares = [getNotesQueryValidationMiddleware, findNotesMiddleware, sendNotesMiddleware];
