import { soloStreakRegistrationValidationMiddleware } from "../../Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware";
import { retreiveUserWithUserIdMiddleware } from "../../Middleware/Database/retreiveUserWithUserIdMiddleware";
import { userExistsValidationMiddleware } from "../../Middleware/Validation/User/userExistsValidationMiddleware";
import { createSoloStreakFromRequestMiddleware } from "../../Middleware/SoloStreak/createSoloStreakFromRequestMiddleware";
import { saveSoloStreakToDatabaseMiddleware } from "../../Middleware/Database/saveSoloStreakToDatabaseMiddleware";
import { sendFormattedSoloStreakMiddleware } from "../../Middleware/SoloStreak/sendFormattedSoloStreakMiddleware";
import { IUser } from "Models/User";
import { ISoloStreak } from "Models/SoloStreak";

export interface SoloStreakRegistrationRequestBody {
    userId: string,
    streakName: string,
    streakDescription: string,
    createdAt: Date,
    modifiedAt: Date
}

export interface SoloStreakResponseLocals {
    user?: IUser,
    newSoloStreak?: ISoloStreak,
    savedSoloStreak?: ISoloStreak,
}

export const createSoloStreakMiddlewares = [
    soloStreakRegistrationValidationMiddleware,
    retreiveUserWithUserIdMiddleware,
    userExistsValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware
];
