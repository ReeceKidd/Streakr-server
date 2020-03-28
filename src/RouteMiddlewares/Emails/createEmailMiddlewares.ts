import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { emailModel, EmailModel } from '../../Models/Email';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { sendEmail as sendEmailFunction } from '../../email';

const createEmailBodyValidationSchema = {
    name: Joi.string().required(),
    email: Joi.string()
        .email()
        .required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
    userId: Joi.string(),
    username: Joi.string(),
};

export const createEmailBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        createEmailBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateEmailFromRequestMiddleware = (emailModel: mongoose.Model<EmailModel>) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { name, email, subject, message, userId, username } = request.body;
        response.locals.newEmail = new emailModel({
            name,
            email,
            subject,
            message,
            userId,
            username,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEmailFromRequestMiddleware, err));
    }
};

export const createEmailFromRequestMiddleware = getCreateEmailFromRequestMiddleware(emailModel);

export const saveEmailToDatabaseMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const newEmail: EmailModel = response.locals.newEmail;
        response.locals.email = await newEmail.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveEmailToDatabaseMiddleware, err));
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSendEmailMiddleware = (sendEmail: typeof sendEmailFunction) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    const { name, email, subject, message, userId, username } = response.locals.email;
    try {
        const text = `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
        UserId: ${userId}
        Username: ${username}`;
        await sendEmail({ subject, text, emailFrom: email });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendEmailMiddleware, err));
    }
};

export const sendEmailMiddleware = getSendEmailMiddleware(sendEmailFunction);

export const emailSentResponseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { email } = response.locals;
        response.status(ResponseCodes.created).send(email);
    } catch (err) {
        next(new CustomError(ErrorType.EmailSentResponseMiddleware, err));
    }
};

export const createEmailMiddlewares = [
    createEmailBodyValidationMiddleware,
    createEmailFromRequestMiddleware,
    saveEmailToDatabaseMiddleware,
    sendEmailMiddleware,
    emailSentResponseMiddleware,
];
