// import { Request, Response } from 'express';

// import IndividualVisibilityTypes from '@streakoid/streakoid-models/lib/Types/IndividualVisibilityTypes';
// import { teamMemberStreakModel } from '../Models/TeamMemberStreak';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const teamMemberStreaks = await teamMemberStreakModel.find({});
//     await Promise.all(
//         teamMemberStreaks.map(async teamMemberStreak => {
//             return teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
//                 $set: { visibility: IndividualVisibilityTypes.everyone },
//             });
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
