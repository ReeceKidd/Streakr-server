// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';
// import { soloStreakModel } from '../../src/Models/SoloStreak';
// import { challengeStreakModel } from '../../src/Models/ChallengeStreak';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find({});
//         await Promise.all(
//             users.map(async user => {
//                 const soloStreaks = await soloStreakModel.find({ userId: user._id });
//                 await Promise.all(
//                     soloStreaks.map(soloStreak => {
//                         return soloStreakModel.findByIdAndUpdate(soloStreak._id, { $set: { timezone: user.timezone } });
//                     }),
//                 );
//                 const challengeStreaks = await challengeStreakModel.find({ userId: user._id });
//                 await Promise.all(
//                     challengeStreaks.map(challengeStreak => {
//                         return challengeStreakModel.findByIdAndUpdate(challengeStreak._id, {
//                             $set: { timezone: user.timezone },
//                         });
//                     }),
//                 );
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         console.log(err);
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
