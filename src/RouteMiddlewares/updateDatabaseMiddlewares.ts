// import { Request, Response } from 'express';

// import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
// import { userModel } from '../Models/User';
// import { LongestSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestSoloStreak';
// import { LongestChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestChallengeStreak';
// import { LongestTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamMemberStreak';
// import { LongestTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamStreak';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const users = await userModel.find({});
//     await Promise.all(
//         users.map(async user => {
//             if ((user.longestEverStreak as LongestSoloStreak).soloStreakId) {
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: { longestEverStreak: { ...user.longestEverStreak, streakType: StreakTypes.solo } },
//                 });
//             }
//             if ((user.longestEverStreak as LongestChallengeStreak).challengeStreakId) {
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: { longestEverStreak: { ...user.longestEverStreak, streakType: StreakTypes.challenge } },
//                 });
//             }
//             if ((user.longestEverStreak as LongestTeamMemberStreak).teamMemberStreakId) {
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: {
//                         longestEverStreak: { ...user.longestEverStreak, streakType: StreakTypes.teamMember },
//                     },
//                 });
//             }
//             if ((user.longestEverStreak as LongestTeamStreak).teamStreakId) {
//                 await userModel.findByIdAndUpdate(user._id, {
//                     $set: {
//                         longestEverStreak: { ...user.longestEverStreak, streakType: StreakTypes.team },
//                     },
//                 });
//             }
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
