// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { teamStreakModel } from '../Models/TeamStreak';
// import shortid from 'shortid';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const teamStreaks = await teamStreakModel.find({});
//         await Promise.all(
//             teamStreaks.map(async teamStreak => {
//                 await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
//                     $set: {
//                         inviteKey: shortid.generate(),
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
