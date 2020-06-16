// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';

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
//                     $set: {
//                         onboarding: { whyDoYouWantToBuildNewHabitsChoice: null },
//                         hasUsernameBeenCustomized: true,
//                         hasCompletedOnboarding: true,
//                         hasUsernameBeenCustomize: null,
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
