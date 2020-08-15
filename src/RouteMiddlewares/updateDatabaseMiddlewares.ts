// import { Request, Response } from 'express';

// import { teamStreakModel } from '../Models/TeamStreak';
// import VisibilityTypes from '@streakoid/streakoid-models/lib/Types/VisibilityTypes';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const teamStreaks = await teamStreakModel.find({});
//     await Promise.all(
//         teamStreaks.map(async teamStreak => {
//             return teamStreakModel.findByIdAndUpdate(teamStreak._id, {
//                 $set: { visibility: VisibilityTypes.everyone },
//             });
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
