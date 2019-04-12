import { NextFunction } from "express";

export const getSoloStreakValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const retreiveUserMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const userExistsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const retreiveSoloStreaksMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const formatSoloStreaksMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const sendFormattedSoloStreaksMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const getSoloStreaksMiddlewares = [
    getSoloStreakValidationMiddleware,
    retreiveUserMiddleware,
    userExistsValidationMiddleware,
    retreiveSoloStreaksMiddleware,
    formatSoloStreaksMiddleware,
    sendFormattedSoloStreaksMiddleware
]