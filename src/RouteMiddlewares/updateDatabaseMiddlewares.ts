// // This is just used to update the datbase while I figure out how to connect robo3t again.

// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';
// import { completeSoloStreakTaskModel } from '../../src/Models/CompleteSoloStreakTask';
// import { completeChallengeStreakTaskModel } from '../../src/Models/CompleteChallengeStreakTask';
// import { completeTeamMemberStreakTaskModel } from '../../src/Models/CompleteTeamMemberStreakTask';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find({});
//         await Promise.all(
//             users.map(async user => {
//                 const completeTotalSoloStreaks = await completeSoloStreakTaskModel.count({ userId: user._id });
//                 const completeTotalChallengeStreaks = await completeChallengeStreakTaskModel.count({
//                     userId: user._id,
//                 });
//                 const completeTeamStreakChallengeStreaks = await completeTeamMemberStreakTaskModel.count({
//                     user: user._id,
//                 });
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
