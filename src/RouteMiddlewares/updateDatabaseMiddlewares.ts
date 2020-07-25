// import { Request, Response } from 'express';
// import { teamStreakModel } from '../Models/TeamStreak';
// import { teamMemberStreakModel } from '../Models/TeamMemberStreak';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const teamMemberStreaks = await teamMemberStreakModel.find({});
//     await Promise.all(
//         teamMemberStreaks.map(async teamMemberStreak => {
//             const teamStreak = await teamStreakModel.findById(teamMemberStreak.teamStreakId);
//             if (teamStreak) {
//                 return teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
//                     $set: { status: teamStreak.status },
//                 });
//             }
//             return teamMemberStreak;
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
