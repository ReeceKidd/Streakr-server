// import { Request, Response } from 'express';
// import { userModel } from '../Models/User';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const users = await userModel.find({});
//     await Promise.all(
//         users.map(async user => {
//             let longestStreak = {
//                 numberOfDays: 0,
//             };
//             const longestSoloStreak = user.longestSoloStreak.numberOfDays;
//             if (longestStreak.numberOfDays < longestSoloStreak) {
//                 longestStreak = user.longestSoloStreak;
//             }
//             const longestChallengeStreak = user.longestChallengeStreak.numberOfDays;
//             if (longestStreak.numberOfDays < longestChallengeStreak) {
//                 longestStreak = user.longestChallengeStreak;
//             }
//             const longestTeamMemberStreak = user.longestTeamMemberStreak.numberOfDays;
//             if (longestStreak.numberOfDays < longestTeamMemberStreak) {
//                 longestStreak = user.longestTeamMemberStreak;
//             }
//             const longestTeamStreak = user.longestTeamStreak.numberOfDays;
//             if (longestStreak.numberOfDays < longestTeamStreak) {
//                 longestStreak = user.longestTeamStreak;
//             }
//             await userModel.findByIdAndUpdate(user._id, {
//                 $set: {
//                     longestEverStreak: longestStreak,
//                 },
//             });
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
