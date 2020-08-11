// import { Request, Response } from 'express';

// import { userModel } from '../Models/User';
// import { UserStreakHelper } from '../helpers/UserStreakHelper';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const users = await userModel.find({});
//     await Promise.all(
//         users.map(async user => {
//             return UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
