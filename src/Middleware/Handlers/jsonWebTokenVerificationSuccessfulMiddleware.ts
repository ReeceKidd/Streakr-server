import { Request, Response, NextFunction } from 'express';
import { SuccessMessageKeys } from '../../Messages/successMessages';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messages';

export const getJsonWebTokenVerificationSuccessfulMiddleware = (jsonWebTokenVerificationSuccessfulMessage: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { decodedJsonWebToken } = response.locals;
        return response.send({ decodedJsonWebToken, message: jsonWebTokenVerificationSuccessfulMessage });
    } catch (err) {
        next(err);
    }
};

const localisedJsonWebTokenVerificationSuccessMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage)

export const jsonWebTokenVerificationSuccessfulMiddleware = getJsonWebTokenVerificationSuccessfulMiddleware(localisedJsonWebTokenVerificationSuccessMessage);
