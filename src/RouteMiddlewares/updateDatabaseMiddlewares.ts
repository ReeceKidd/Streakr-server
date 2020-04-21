// // This is just used to update the datbase while I figure out how to connect robo3t again.

// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { challengeModel } from '../../src/Models/Challenge';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const challenges = await challengeModel.find({});
//         await Promise.all(
//             challenges.map(challenge => {
//                 return challengeModel.findByIdAndUpdate(challenge._id, {
//                     $set: {
//                         databaseName: challenge.name.toLowerCase(),
//                     },
//                 });
//             }),
//         );
//         response.send('success');
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetreiveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
