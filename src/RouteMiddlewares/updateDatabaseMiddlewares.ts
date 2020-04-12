// // This is just used to update the datbase while I figure out how to connect robo3t again.

// import { Request, Response, NextFunction } from 'express';

// import { userModel } from '../Models/User';
// import { CustomError, ErrorType } from '../customError';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find({});
//         await Promise.all(
//             users.map(async user => {
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: { 'notifications.newFollowerUpdates': { emailNotification: true, pushNotification: true } },
//                 });
//             }),
//         );
//         response.send('Success');
//     } catch (err) {
//         if (err instanceof CustomError) next(err);
//         else next(new CustomError(ErrorType.GetRetreiveUserMiddleware, err));
//     }
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
