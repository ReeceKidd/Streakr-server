// import { Request, Response, NextFunction } from 'express';

// import { CustomError, ErrorType } from '../customError';
// import { userModel } from '../../src/Models/User';

// export const updateDatabaseMiddleware = async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const users = await userModel.find({
//             'profileImages.originalImageUrl': 'https://streakoid-images.s3-eu-west-1.amazonaws.com/oid-icon.png',
//         });
//         await Promise.all(
//             users.map(async user => {
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: {
//                         'profileImages.originalImageUrl':
//                             'https://streakoid-images.s3-eu-west-1.amazonaws.com/user-icon.png',
//                     },
//                 });
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
