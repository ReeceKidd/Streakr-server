// import { Request, Response } from 'express';
// import { teamStreakModel } from '../Models/TeamStreak';
// import { userModel } from '../Models/User';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const users = await userModel.find({});

//     await Promise.all(
//         users.map(async user => {
//             const teamStreaks = await teamStreakModel.find({ 'members.memberId': String(user._id) });
//             const longestTeamStreakDays = teamStreaks.map(teamStreak => teamStreak.longestTeamStreak.numberOfDays);
//             const longestTeamStreakLength = Math.max(...longestTeamStreakDays);
//             const longestTeamStreak = teamStreaks.find(
//                 teamStreak => teamStreak.longestTeamStreak.numberOfDays === longestTeamStreakLength,
//             );
//             if (longestTeamStreak) {
//                 return userModel.findByIdAndUpdate(user._id, {
//                     $set: {
//                         longestTeamStreak: longestTeamStreak.longestTeamStreak,
//                     },
//                 });
//             }
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
