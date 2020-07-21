// import { Request, Response } from 'express';
// import { soloStreakModel } from '../Models/SoloStreak';
// import { LongestSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestSoloStreak';

// export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
//     const soloStreaks = await soloStreakModel.find({});

//     await Promise.all(
//         soloStreaks.map(soloStreak => {
//             const pastStreakLengths = soloStreak.pastStreaks.map(pastStreak => pastStreak.numberOfDaysInARow);
//             const longestPastStreakNumberOfDays = Math.max(...pastStreakLengths);
//             const longestPastStreak = soloStreak.pastStreaks.find(
//                 soloStreak => soloStreak.numberOfDaysInARow === longestPastStreakNumberOfDays,
//             );
//             const longestStreak =
//                 soloStreak.currentStreak.numberOfDaysInARow >= longestPastStreakNumberOfDays
//                     ? soloStreak.currentStreak
//                     : longestPastStreak;
//             const longestSoloStreak: LongestSoloStreak = {
//                 soloStreakId: soloStreak._id,
//                 soloStreakName: soloStreak.streakName,
//                 numberOfDays: (longestStreak && longestStreak.numberOfDaysInARow) || 0,
//                 startDate: new Date((longestStreak && longestStreak.startDate) || new Date()),
//                 endDate:
//                     longestStreak && longestStreak.endDate
//                         ? new Date(longestStreak && longestStreak.endDate)
//                         : undefined,
//             };
//             return soloStreakModel.findByIdAndUpdate(soloStreak._id, {
//                 $set: {
//                     longestSoloStreak,
//                 },
//             });
//         }),
//     );

//     response.send('Success');
// };

// export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
