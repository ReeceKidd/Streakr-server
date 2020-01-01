import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const noteParamsValidationSchema = {
    noteId: Joi.string().required(),
};

export const noteParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        noteParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteNoteMiddleware = (noteModel: mongoose.Model<NoteModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { noteId } = request.params;
        const deletedNote = await noteModel.findByIdAndDelete(noteId);
        if (!deletedNote) {
            throw new CustomError(ErrorType.NoNoteToDeleteFound);
        }
        response.locals.deletedNote = deletedNote;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteNoteMiddleware, err));
    }
};

export const deleteNoteMiddleware = getDeleteNoteMiddleware(noteModel);

export const getSendNoteDeletedResponseMiddleware = (successfulDeletetionResponseCode: ResponseCodes) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendNoteDeletedResponseMiddleware, err));
    }
};

export const sendNoteDeletedResponseMiddleware = getSendNoteDeletedResponseMiddleware(ResponseCodes.deleted);

export const deleteNoteMiddlewares = [
    noteParamsValidationMiddleware,
    deleteNoteMiddleware,
    sendNoteDeletedResponseMiddleware,
];
