// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';
// import { teamStreakModel } from '../Models/TeamStreak';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const teamStreaks = await teamStreakModel.find({});
//         await Promise.all(
//             teamStreaks.map(async teamStreak => {
//                 await teamStreak.findByIdAndUpdate(teamStreak._id, {
//                     $set: {
//                         pushNotification: {
//                             androidToken: null,
//                             iosToken: null,
//                             androidEndpointArn: null,
//                             iosEndpointArn: null,
//                         },
//                     },
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
