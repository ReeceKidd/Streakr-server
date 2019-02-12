import { streakRegistrationValidationMiddleware } from "Middleware/Validation/Streak/streakRegistrationValidationMiddleware";

export const registerUserMiddlewares = [
    streakRegistrationValidationMiddleware,

    hashPasswordMiddleware,
    createUserFromRequestMiddleware,
    saveUserToDatabaseMiddleware,
    sendFormattedUserMiddleware
];

