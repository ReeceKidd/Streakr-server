import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { noteModel, NoteModel } from '../../Models/Note';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getNoteParamsValidationSchema = {
    noteId: Joi.string().required(),
};

export const getNoteParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        getNoteParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveNoteMiddleware = (noteModel: mongoose.Model<NoteModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { noteId } = request.params;
        const note = await noteModel.findOne({ _id: noteId }).lean();
        if (!note) {
            throw new CustomError(ErrorType.GetNoNoteFound);
        }
        response.locals.note = note;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveNoteMiddleware, err));
    }
};

export const retreiveNoteMiddleware = getRetreiveNoteMiddleware(noteModel);

export const getSendNoteMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { note } = response.locals;
        response.status(resourceCreatedResponseCode).send(note);
    } catch (err) {
        next(new CustomError(ErrorType.SendNoteMiddleware, err));
    }
};

export const sendNoteMiddleware = getSendNoteMiddleware(ResponseCodes.success);

export const getOneNoteMiddlewares = [getNoteParamsValidationMiddleware, retreiveNoteMiddleware, sendNoteMiddleware];
